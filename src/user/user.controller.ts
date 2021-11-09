import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { StoreTokenService } from '../store_token/storeToken.service';
import { AuthGuard } from '../guards/auth.guard';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/UserDto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { UserUpdateDto } from './dto/UserUpdateDto';
import { BlockedUserDto } from './dto/BlockedUserDto';
import { UnBlockUserDto } from './dto/UnBlockUserDto';
import { UploadImageDto } from './dto/UploadImageDto';
import { StoreTokenDto } from '../store_token/dto/StoreTokenDto';
import { CreateStoreTokenDto } from '../store_token/dto/CreateStoreTokenDto';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    public readonly userService: UserService,
    public readonly storeTokenService: StoreTokenService
  ) {}
  @UseGuards(AuthGuard)
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserDto,
    description: 'get user',
  })
  async getUser(@AuthUser() user: UserEntity): Promise<any> {
    return this.userService.findUser(user.id);
  }
  @UseGuards(AuthGuard)
  @Put('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserDto,
    description: 'edit user',
  })
  async editUser(
    @AuthUser() user: UserEntity,
    @Body() userData: UserUpdateDto,
  ): Promise<UserDto> {
    return this.userService.updateUser(user, userData);
  }
  @UseGuards(AuthGuard)
  @Post('uploadProfilePicture')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'upload image',
  })
  async uploadImage(
    @Body() uploadImageDto: UploadImageDto,
    @AuthUser() user: UserEntity,
  ): Promise<UserDto> {
    return this.userService.uploadImage(uploadImageDto.file, user);
  }
  @UseGuards(AuthGuard)
  @Post('blockUser')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: BlockedUserDto,
    description: 'block user',
  })
  async blockUser(
    @AuthUser() user: UserEntity,
    @Body() blockedUserDto: BlockedUserDto,
  ): Promise<UserDto> {
    return this.userService.blockUser(user, blockedUserDto);
  }
  @UseGuards(AuthGuard)
  @Post('unBlockUser')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UnBlockUserDto,
    description: 'un block user',
  })
  async unBlockUser(
    @AuthUser() user: UserEntity,
    @Body() blockedUserDto: BlockedUserDto,
  ): Promise<UserDto> {
    return this.userService.unBlockUser(user, blockedUserDto);
  }
  @UseGuards(AuthGuard)
  @Post('storeFirebaseToken')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: CreateStoreTokenDto,
    description: 'storeFirebaseToken',
  })
  async storeToken(
    @AuthUser() user: UserEntity,
    @Body() createStoreTokenDto: CreateStoreTokenDto,
  ): Promise<StoreTokenDto> {
    return this.storeTokenService.createOrUpdate(user, createStoreTokenDto);
  }
}
