import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { MessageDto } from './dto/MessageDto';
import { MessageEntity } from './message.entity';
import { UserRepository } from '../user/user.repository';
import { MessageRepository } from './message.repository';
import { AppGateway } from '../gateway/app.gateway';
import { GroupRepository } from '../group/group.repository';
import { GroupEntity } from '../group/group.entity';
import { LastMessageViewerDto } from "./dto/LastMessageViewerDto";

@Injectable()
export class MessageService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly groupRepository: GroupRepository,
    public readonly messageRepository: MessageRepository,
    public readonly appGateway: AppGateway,
  ) {}

  async create(
    user: UserEntity,
    createMessageDto: CreateMessageDto,
  ): Promise<MessageDto> {
    const receiver = await this.userRepository.findOne({
      id: createMessageDto.receiverId,
    });
    if (!receiver) {
      throw new NotFoundException('User not found');
    }
    const group = await this.groupRepository.findOne(createMessageDto.groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    const messageModel = new MessageEntity();
    messageModel.sender = user;
    messageModel.message = createMessageDto.message;
    createMessageDto.messageImage
      ? (messageModel.messageImage = createMessageDto.messageImage)
      : null;
    createMessageDto.dropOff
      ? (messageModel.dropOff = createMessageDto.dropOff)
      : null;
    messageModel.group = group;

    const message = await this.messageRepository.save(messageModel);
    group.lastMessage = message.id;
    await this.groupRepository.save(group);
    const messageDto = message.toDto();
    const room = group.id;
    await this.appGateway.create(null, messageDto, room);

    return messageDto;
  }

  async createGroupByReceiverId(
    user: UserEntity,
    receiverId: string,
  ): Promise<GroupEntity> {
    const receiver: UserEntity = await this.userRepository.findOne({
      id: receiverId,
    });
    if (!receiver) {
      throw new NotFoundException('User not found');
    }
    let group = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.users @> ARRAY[:sender]::uuid[]', { sender: user.id })
      .andWhere('group.users @> ARRAY[:receiverId]::uuid[]', {
        receiverId,
      })
      .getOne();
    if (!group) {
      const groupModel = await this.groupRepository.create({
        users: [receiver.id, user.id],
      });
      group = await this.groupRepository.save(groupModel);
    }
    return await this._getOneGroup(group.id, user);
  }

  async getAllMessagesByGroup(
    user: UserEntity,
    groupId: string,
    query: { limit: number; offset: number },
  ): Promise<{
    messages: MessageDto[];
    receiver: UserEntity;
    senderId: string;
  }> {
    const offset = query.offset ? query.offset : 0;
    const limit = query.limit ? query.limit : 10;
    const group = await this.groupRepository.findOne(groupId);
    if (!group) {
      throw new NotFoundException('group');
    }
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.group  = :groupId', { groupId })
      .leftJoinAndSelect('message.group', '_group')
      .andWhere('_group.users @> ARRAY[:user]::uuid[]', {
        user: user.id,
      })
      .leftJoinAndSelect('message.sender', '_sender')
      .select([
        'message.message',
        'message.id',
        '_sender.id',
        'message.messageImage',
        'message.dropOff',
      ])
      .orderBy('message.createdAt', 'ASC')
      .offset(offset)
      .limit(limit)
      .getMany();
    const receiverId = group.users.splice(group.users.indexOf(user.id, 1));
    const receiver = await this.userRepository.findOne({
      where: {
        id: receiverId[0],
      },
      select: ['profilePicture', 'id'],
    });

    return {
      messages: messages.map((item) => item.toDto()),
      receiver,
      senderId: group.users[0],
    };
  }

  async getAllMessages(
    user: UserEntity,
  ): Promise<{ count: number; messages: MessageDto[] }> {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.users @> ARRAY[:user]::text[]', {
        user: user.id,
      })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
    return {
      messages: messages.map((item) => item.toDto()),
      count: messages.length,
    };
  }

  private async _getOneGroup(groupId, user: UserEntity): Promise<GroupEntity> {
    return await this.groupRepository
      .createQueryBuilder('group')
      .where('group.id  = :groupId', { groupId })
      .andWhere('group.users @> ARRAY[:user]::uuid[]', {
        user: user.id,
      })
      .leftJoinAndSelect('group.lastMessage', '_lastMessage')
      .leftJoinAndMapMany(
        'group.users',
        UserEntity,
        'user',
        'ARRAY[(user.id)] <@ (group.users)',
      )
      .orderBy('group.createdAt', 'ASC')
      .select([
        'group',
        'user.profilePicture',
        'user.id',
        'user.firstName',
        '_lastMessage',
      ])
      .getOne();
  }

  async getGroup(user: UserEntity): Promise<GroupEntity[]> {
    return await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.lastMessage', '_lastMessage')
      .where('group.users @> ARRAY[:user]::uuid[]', {
        user: user.id,
      })
      .leftJoinAndMapMany(
        'group.users',
        UserEntity,
        'user',
        'ARRAY[(user.id)] <@ (group.users)',
      )
      .orderBy('group.createdAt', 'ASC')
      .select([
        'group',
        'user.profilePicture',
        'user.id',
        'user.firstName',
        '_lastMessage',
      ])
      .getMany();
  }

  async delete(id: string, user: UserEntity): Promise<void> {
    const message = await this.messageRepository.findOne({
      id,
      sender: user,
    });
    if (!message) {
      throw new NotFoundException();
    }
    await this.messageRepository.delete(id);
  }

  async readMessage(
    id: string,
    user: UserEntity,
    lastMessageViewerDto: LastMessageViewerDto,
  ): Promise<GroupEntity> {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.users @> ARRAY[:user]::uuid[]', {
        user: user.id,
      })
      .andWhere('group.id  = :id', { id })
      .getOne();
    if (!group) {
      throw new NotFoundException('group not found');
    }
    group.lastMessageViewer = lastMessageViewerDto.id;
    return await this.groupRepository.save(group);
  }
  async checkUnreadMessage(user: UserEntity): Promise<boolean> {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.users @> ARRAY[:user]::uuid[]', {
        user: user.id,
      })
      .andWhere('group.lastMessageViewer  = :id ', {
        id: user.id,
      })
      .getOne();
    if (!group) {
      return false;
    }
    return true;
  }
}
