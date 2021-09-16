import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { GroupEntity } from '../group/group.entity';

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
  @Post('group')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: GroupEntity,
    description: 'create group',
  })
  async getGroupByReceiverId(
    @Query('receiverId', new ParseUUIDPipe()) receiverId: string,
    @AuthUser() user: UserEntity,
  ): Promise<GroupEntity> {
    return await this.messageService.createGroupByReceiverId(user, receiverId);
  }
  @UseGuards(AuthGuard)
  @Get('group/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [MessageDto],
    description: 'get all messages by group',
  })
  async getAllMessagesByGroup(
    @AuthUser() user: UserEntity,
    @Param('id') id: string,
    @Query() query: { limit: number; offset: number },
  ): Promise<{
    messages: MessageDto[];
    receiver: UserEntity;
    senderId: string;
  }> {
    return await this.messageService.getAllMessagesByGroup(user, id, query);
  }
  @UseGuards(AuthGuard)
  @Get('groups')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [GroupEntity],
    description: 'get groups-user',
  })
  async getGroup(@AuthUser() user: UserEntity): Promise<GroupEntity[]> {
    return await this.messageService.getGroup(user);
  }
  @UseGuards(AuthGuard)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [MessageDto],
    description: 'get all messages',
  })
  async getAllMessages(
    @AuthUser() user: UserEntity,
  ): Promise<{ count: number; messages: MessageDto[] }> {
    return await this.messageService.getAllMessages(user);
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
  @UseGuards(AuthGuard)
  @Post('readMessage/group/:id')
  @HttpCode(200)
  @ApiOkResponse({
    type: GroupEntity,
    description: 'read message',
  })
  async readMessage(
    @AuthUser() user: UserEntity,
    @Param('id') id: string,
    @Body() lastMessageViewer: string,
  ): Promise<GroupEntity> {
    return await this.messageService.readMessage(id, user, lastMessageViewer);
  }
  @UseGuards(AuthGuard)
  @Get('check/unread')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'check unread message',
  })
  async checkUnreadMessage(@AuthUser() user: UserEntity): Promise<boolean> {
    return await this.messageService.checkUnreadMessage(user);
  }
}
