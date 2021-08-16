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
import { GroupUserRepository } from '../group_user/groupUser.repository';

@Injectable()
export class MessageService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly groupRepository: GroupRepository,
    public readonly groupUserRepository: GroupUserRepository,
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
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.users @> ARRAY[:user]::text[]', {
        user: user.id,
      })
      .andWhere('message.users @> ARRAY[:receiverId]::text[]', {
        receiverId: createMessageDto.receiverId,
      })
      .leftJoinAndSelect('message.group', '_group')
      .select('_group.id')
      .getOne();
    console.log(messages, 444);
    let group: GroupEntity;
    if (!createMessageDto.groupId) {
      const groupModel = await this.groupRepository.create({});
      group = await this.groupRepository.save(groupModel);
    } else {
      group = await this.groupRepository.findOne(createMessageDto.groupId);
    }

    const messageModel = new MessageEntity();
    messageModel.sender = user;
    messageModel.message = createMessageDto.message;
    messageModel.users = [receiver.id, user.id];
    messageModel.group = group;

    const message = await this.messageRepository.save(messageModel);
    const messageDto = message.toDto();
    const groupUser = await this.groupUserRepository.findOne({
      where: {
        group,
        user,
      },
    });
    if (!groupUser) {
      const groupUserModel = await this.groupUserRepository.create({
        group,
        user,
      });
      await this.groupUserRepository.save(groupUserModel);
    }
    // Send socket event to created message
    const room = group.id;
    await this.appGateway.create(null, messageDto, room);

    return messageDto;
  }
  async getMessages(
    user: UserEntity,
    receiverId: string,
    query: { limit: number; offset: number },
  ): Promise<{ count: number; messages: MessageDto[] }> {
    const offset = query.offset ? query.offset : 0;
    const limit = query.limit ? query.limit : 10;
    const receiver = await this.userRepository.findOne({
      id: receiverId,
    });
    if (!receiver) {
      throw new NotFoundException('User not found');
    }
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.sender  = :sender', { sender: user.id })
      .andWhere('message.users @> ARRAY[:receiverId]::text[]', {
        receiverId,
      })
      .offset(offset)
      .limit(limit)
      .orderBy('message.createdAt', 'DESC')
      .getMany();
    return {
      messages: messages.map((item) => item.toDto()),
      count: messages.length,
    };
  }
  async getAllMessagesByGroup(
    user: UserEntity,
    groupId: string,
  ): Promise<{ messages: MessageDto[]; receiver: UserEntity }> {
    const group = await this.groupRepository.findOne(groupId);
    if (!group) {
      throw new NotFoundException('group');
    }
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.users @> ARRAY[:user]::text[]', {
        user: user.id,
      })
      .leftJoinAndSelect('message.sender', '_sender')
      .select(['message.message', 'message.id', '_sender.id'])
      .andWhere('message.group  = :groupId', { groupId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();
    const messageReceiver = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.users @> ARRAY[:user]::text[]', {
        user: user.id,
      })
      .andWhere('message.group  = :groupId', { groupId })
      .orderBy('message.createdAt', 'DESC')
      .getOne();
    const receiverId = messageReceiver.users.splice(
      messageReceiver.users.indexOf(user.id, 1),
    );
    const receiver = await this.userRepository.findOne({
      where: {
        id: receiverId[0],
      },
      select: ['profilePicture', 'id'],
    });

    return {
      receiver,
      messages: messages.map((item) => item.toDto()),
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
      .orderBy('message.createdAt', 'DESC')
      .getMany();
    return {
      messages: messages.map((item) => item.toDto()),
      count: messages.length,
    };
  }
  async getGroup(user: UserEntity): Promise<GroupEntity[]> {
    return await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.messages', '_messages')
      .leftJoinAndSelect('group.groupUsers', '_groupUsers')
      .leftJoinAndSelect('_groupUsers.lastReceived', '_lastReceived')
      .leftJoinAndSelect('_groupUsers.lastRead', '_lastRead')
      .select(['group', '_messages', '_groupUsers'])
      .where('_messages.users @> ARRAY[:user]::text[]', {
        user: user.id,
      })
      .orderBy('_messages.createdAt', 'DESC')
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
}
