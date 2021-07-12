import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDto } from './dto/UserLoginDto';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { TokenPayloadDto } from './dto/TokenPayloadDto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../user/dto/UserDto';
import { LoginPayloadDto } from './dto/LoginPayloadDto';

@Injectable()
export class AuthService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly jwtService: JwtService,
  ) {}
  async getUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      email,
    });
  }
  async loginUser(userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.validateUser(userLoginDto);
    if (!userEntity.verified) {
      throw new UnauthorizedException();
    }

    // const userEntity = await this.validateUser(userLoginDto);
    const token = await this.createToken(userEntity);
    return new LoginPayloadDto(userEntity.toDto(), token);
  }
  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.getUserByEmail(userLoginDto.email);
    const isPasswordValid = await this.validateHash(
      userLoginDto.password,
      user && user.password,
    );
    if (!user || !isPasswordValid) {
      throw new NotFoundException();
    }
    return user;
  }
  async createToken(user: UserDto): Promise<any> {
    return new TokenPayloadDto({
      expiresIn: Number(process.env.JWT_EXPIRATION_TIME),
      accessToken: await this.jwtService.signAsync({ id: user.id }),
    });
  }
  async validateHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash || '');
  }
}
