import {
  BadRequestException,
  Body,
  CACHE_MANAGER,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { UserRegisterDto } from './dto/UserRegisterDto';
import { UserDto } from '../user/dto/UserDto';
import { UserService } from '../user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';
import { UserVerifyDto } from './dto/UserVerifyDto';
import { UserRepository } from '../user/user.repository';
import { UserLoginDto } from './dto/UserLoginDto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    public readonly authService: AuthService,
    public readonly userService: UserService,
    public readonly mailService: MailService,
    private readonly userRepository: UserRepository, // @Inject(CACHE_MANAGER) private readonly _cacheManager: Cache,
  ) {}
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<UserDto> {
    const isExists = await this.userService.checkIfExists(
      userRegisterDto.email,
    );
    if (isExists) {
      throw new ConflictException();
    }

    const createdUser = await this.userService.createUser(
      userRegisterDto,
      // file,
    );
    const code = Math.floor(1000 + Math.random() * 9000);
    await this.userRepository.update(
      { email: createdUser.email },
      { verifiedCode: code },
    );
    // await this._cacheManager.set(code, createdUser.id, { ttl: 3600 });

    const user = createdUser.toDto();
    await this.mailService.sendConfirmationEmail(user, code);
    return user;
  }
  @Post('verifyOTP')
  @HttpCode(HttpStatus.OK)
  async verifyOTP(@Body() userVerifyDto: UserVerifyDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      email: userVerifyDto.email,
    });
    if (!user) {
      throw new NotFoundException();
    }
    const verifyUser = await this.userService.checkIfUserVerify();
    if (verifyUser) {
      throw new BadRequestException('user has been verified');
    }
    const checkCode = await this.userService.checkVerifyCode(
      userVerifyDto.email,
      Number(userVerifyDto.code),
    );
    if (!checkCode) {
      throw new BadRequestException('incorrect code');
    }
    return await this.userService.verifyUser(userVerifyDto);
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async userLogin(@Body() userLoginDto: UserLoginDto): Promise<any> {
    return this.authService.loginUser(userLoginDto);
  }
}
