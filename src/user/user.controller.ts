import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards, UseInterceptors
} from "@nestjs/common";
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/UserDto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { UserUpdateDto } from './dto/UserUpdateDto';
import { IFile } from '../interfaces/IFile';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('user')
@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(public readonly userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UserDto,
    description: 'get user',
  })
  async getUser(@AuthUser() user: UserEntity): Promise<UserDto> {
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
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('type') typeUpload: string,
    @UploadedFile() file: IFile,
    @AuthUser() user: UserEntity,
  ): Promise<UserDto> {
    return this.userService.uploadImage(typeUpload, file, user);
  }
}
