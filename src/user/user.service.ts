import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { UserVerifyDto } from '../auth/dto/UserVerifyDto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/UserDto';
import * as bcrypt from 'bcrypt';
import { FindConditions } from 'typeorm';
import { UserUpdateDto } from './dto/UserUpdateDto';

@Injectable()
export class UserService {
  constructor(public readonly userRepository: UserRepository) {}

  async findUser(userId: string): Promise<UserDto> {
    const user = await this.findOne({ id: userId });
    return new UserDto(user);
  }
  /**
   * Find single user
   */
  findOne(findData: FindConditions<UserEntity>): Promise<UserEntity> {
    return this.userRepository.findOne(findData);
  }
  /**
   * generate hash from password or string
   * @param {string} password
   * @returns {string}
   */
  generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = this.userRepository.create({
      ...userRegisterDto,
      password: this.generateHash(userRegisterDto.password),
    });
    return this.userRepository.save(user);
  }
  public async checkIfExists(email: string): Promise<boolean> {
    return (
      (await this.userRepository
        .createQueryBuilder('user')
        .where('user.email= :email', { email })
        .getCount()) > 0
    );
  }
  public async checkVerifyCode(email: string, code: number): Promise<boolean> {
    return (
      (await this.userRepository
        .createQueryBuilder('user')
        .where('user.verifiedCode= :code', { code })
        .andWhere('user.email= :email', { email })
        .getCount()) > 0
    );
  }
  public async checkIfUserVerify(): Promise<boolean> {
    return (
      (await this.userRepository
        .createQueryBuilder('user')
        .where('user.verified= :verified', { verified: true })
        .getCount()) > 0
    );
  }
  async verifyUser(userVerifyDto: UserVerifyDto): Promise<UserDto> {
    await this.userRepository.update(
      { email: userVerifyDto.email },
      { verified: true },
    );
    const user = await this.userRepository.findOne({
      email: userVerifyDto.email,
    });

    return user.toDto();
  }
  async updateUser(
    user: UserEntity,
    userData: UserUpdateDto,
  ): Promise<UserDto> {
    const verifyUser = await this.checkIfUserVerify();
    if (!verifyUser) {
      throw new BadRequestException('user no verified');
    }
    await this.userRepository.update({ id: user.id }, userData);
    const updateUser = await this.userRepository.findOne({ id: user.id });

    return new UserDto(updateUser);
  }
}
