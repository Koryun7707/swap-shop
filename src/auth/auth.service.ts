import {
  BadRequestException,
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
import { MailService } from '../mail/mail.service';
import { ResetPasswordConfirmDto } from './dto/ResetPasswordConfirmDto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly jwtService: JwtService,
    public readonly mailService: MailService,
    public readonly userService: UserService,
  ) {}
  async getUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      email,
    });
  }
  async loginUser(userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.validateUser(userLoginDto);
    if (!userEntity.verified) {
      throw new BadRequestException('User not verified');
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
  async resetPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne(email);
    if (!user) {
      throw new NotFoundException();
    }
    const code = Math.floor(1000 + Math.random() * 9000);
    await this.userRepository.update(
      { email: user.email },
      { verifiedCode: code },
    );
    await this.mailService.sendConfirmationEmail(user, code);
  }
  async resetPasswordConfirm(
    resetPasswordConfirmDto: ResetPasswordConfirmDto,
  ): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      email: resetPasswordConfirmDto.email,
    });
    if (!user) {
      throw new NotFoundException();
    }
    const checkCode = await this.userService.checkVerifyCode(
      resetPasswordConfirmDto.email,
      resetPasswordConfirmDto.code,
    );
    if (!checkCode) {
      throw new BadRequestException('incorrect code');
    }
    await this.userRepository.update(
      { email: user.email },
      {
        password: this.userService.generateHash(
          resetPasswordConfirmDto.password,
        ),
        verifiedCode: null,
        verified: true,
      },
    );
    return user.toDto();
  }
}
