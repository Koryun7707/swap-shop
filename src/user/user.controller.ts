import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserEntity } from './user.entity';
import { UserDto } from './dto/UserDto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';

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
}
