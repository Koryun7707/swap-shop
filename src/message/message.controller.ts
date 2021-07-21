import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { MessageDto } from './dto/MessageDto';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { MessageService } from './message.service';

@Controller('message')
@ApiTags('message')
@ApiBearerAuth()
export class MessageController {
  constructor(public readonly messageService: MessageService) {}
  @UseGuards(AuthGuard)
  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: MessageDto,
    description: 'create message',
  })
  async create(
    @AuthUser() user: UserEntity,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageDto> {
    return this.messageService.create(user, createMessageDto);
  }
  @UseGuards(AuthGuard)
  @Get(':receiverId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [MessageDto],
    description: 'get messages',
  })
  async getMessages(
    @AuthUser() user: UserEntity,
    @Param('receiverId') receiverId: string,
    @Query() query: { limit: number; offset: number },
  ): Promise<{ count: number; messages: MessageDto[] }> {
    return await this.messageService.getMessages(user, receiverId, query);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(204)
  @ApiOkResponse({
    type: MessageDto,
    description: 'delete message',
  })
  async delete(
    @AuthUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<void> {
    await this.messageService.delete(id, user);
  }
}
