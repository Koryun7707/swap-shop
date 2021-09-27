import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRegisterDto } from '../auth/dto/UserRegisterDto';
import { UserVerifyDto } from '../auth/dto/UserVerifyDto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserDto } from './dto/UserDto';
import * as bcrypt from 'bcrypt';
import { FindConditions } from 'typeorm';
import { UserUpdateDto } from './dto/UserUpdateDto';
import { AwsS3Service } from '../shared/services/aws-s3.service';
import { MailService } from '../mail/mail.service';
import { BlockedUserDto } from './dto/BlockedUserDto';

@Injectable()
export class UserService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly awsS3Service: AwsS3Service,
    public readonly mailService: MailService,
  ) {}

  async findUser(userId: string): Promise<any> {
    const user = await this.findOne({ id: userId });
    let blockedUsers = [];
    let blockedByUsers = [];
    if (user.blocked && user.blocked.length) {
      blockedUsers = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id IN (:...blocked)', {
          blocked: user.blocked,
        })
        .select(['user.profilePicture', 'user.firstName', 'user.id'])
        .getMany();
    }
    if (user.blockedBy && user.blockedBy.length) {
      blockedByUsers = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id IN (:...blockedBy)', {
          blockedBy: user.blockedBy,
        })
        .select(['user.profilePicture', 'user.firstName', 'user.id'])
        .getMany();
    }
    const result = {
      ...user,
      blocked: blockedUsers,
      blockedBy: blockedByUsers,
    };
    return result;
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
  public generateHash(password: string): string {
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

  public async checkIfUserVerify(email: string): Promise<boolean> {
    return (
      (await this.userRepository
        .createQueryBuilder('user')
        .where('user.verified= :verified', { verified: true })
        .andWhere('user.email= :email', { email })
        .getCount()) > 0
    );
  }

  async verifyUser(userVerifyDto: UserVerifyDto): Promise<UserDto> {
    await this.userRepository.update(
      { email: userVerifyDto.email },
      { verified: true, verifiedCode: null },
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
    const verifyUser = await this.checkIfUserVerify(user.email);
    if (!verifyUser) {
      throw new BadRequestException('user no verified');
    }
    await this.userRepository.update(
      { id: user.id },
      { ...userData, completedProfile: true },
    );
    const updateUser = await this.userRepository.findOne({ id: user.id });

    return new UserDto(updateUser);
  }

  async uploadImage(file: string, user: UserEntity): Promise<UserDto> {
    const path = await this.awsS3Service.uploadImage(file, user);

    await this.userRepository.update(
      {
        id: user.id,
      },
      { profilePicture: path },
    );
    const updateUser = await this.userRepository.findOne({ id: user.id });
    return updateUser.toDto();
  }

  async blockUser(
    user: UserEntity,
    blockedUserDto: BlockedUserDto,
  ): Promise<UserDto> {
    const userBlocked = await this.userRepository.findOne({
      id: blockedUserDto.blockUserId,
    });
    if (!userBlocked) {
      throw new NotFoundException('User not found');
    }
    return await this._block(userBlocked, user);
  }

  async unBlockUser(
    user: UserEntity,
    blockedUserDto: BlockedUserDto,
  ): Promise<UserDto> {
    const userBlocked = await this.userRepository.findOne({
      id: blockedUserDto.blockUserId,
    });
    if (!userBlocked) {
      throw new NotFoundException('User not found');
    }
    return await this._unBlock(userBlocked, user);
  }

  private async _unBlock(userBlocked: UserEntity, user: UserEntity) {
    const index = userBlocked.blockedBy.indexOf(user.id);
    const index1 = user.blocked.indexOf(userBlocked.id);
    if (index === -1 || index1 === -1) {
      throw new BadRequestException('user not blocked');
    }
    userBlocked.blockedBy.splice(index, 1);
    await this.userRepository.save(userBlocked);
    user.blocked.splice(index1, 1);

    return this.userRepository.save(user);
  }
  private async _block(userBlocked: UserEntity, user: UserEntity) {
    userBlocked.blockedBy
      ? userBlocked.blockedBy.push(user.id)
      : (userBlocked.blockedBy = [user.id]);
    userBlocked.blockedBy = [...new Set(userBlocked.blockedBy)];
    await this.userRepository.save(userBlocked);
    const userUpdate = await this.userRepository.findOne({ id: user.id });
    userUpdate.blocked
      ? userUpdate.blocked.push(userBlocked.id)
      : (userUpdate.blocked = [userBlocked.id]);
    userUpdate.blocked = [...new Set(userUpdate.blocked)];
    await this.mailService.sendEmailWhenBlockUser(user, userBlocked);
    return this.userRepository.save(userUpdate);
  }
}
