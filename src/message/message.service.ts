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
      .getOne();
    let group: GroupEntity;
    if (messages && messages.group) {
      group = await this.groupRepository.findOne(messages.group.id);
    } else {
      const groupModel = await this.groupRepository.create({});
      group = await this.groupRepository.save(groupModel);
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
    messageModel.users = [receiver.id, user.id];
    messageModel.group = group;

    const message = await this.messageRepository.save(messageModel);
    const messageDto = message.toDto();
    const groupUserSender = await this.groupUserRepository.findOne({
      where: {
        group,
        user,
      },
    });
    const groupUserReceiver = await this.groupUserRepository.findOne({
      where: {
        group,
        user,
      },
    });
    if (!groupUserSender) {
      const groupUserModel = await this.groupUserRepository.create({
        group,
        user,
      });
      await this.groupUserRepository.save(groupUserModel);
    }
    if (!groupUserReceiver) {
      const groupUserModel = await this.groupUserRepository.create({
        group,
        user: receiver,
      });
      await this.groupUserRepository.save(groupUserModel);
    }
    // Send socket event to created message
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
    const messageGroup = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.group', '_group')
      .where('message.sender  = :sender', { sender: user.id })
      .andWhere('message.users @> ARRAY[:receiverId]::text[]', {
        receiverId,
      })
      .getOne();
    let group: GroupEntity;
    if (messageGroup) {
      group = await this.groupRepository.findOne({
        where: {
          id: messageGroup.group.id,
        },
      });
    } else {
      const groupModel = await this.groupRepository.create({});
      group = await this.groupRepository.save(groupModel);
      const messageModel = new MessageEntity();
      messageModel.sender = user;
      messageModel.users = [receiver.id, user.id];
      messageModel.group = group;
      const groupUserModelSender = await this.groupUserRepository.create({
        group,
        user,
      });
      await this.groupUserRepository.save(groupUserModelSender);
      const groupUserModelReceiver = await this.groupUserRepository.create({
        group,
        user: receiver,
      });
      await this.groupUserRepository.save(groupUserModelReceiver);

      await this.messageRepository.save(messageModel);
    }
    return await this._getOneGroup(group.id);
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
      .select([
        'message.message',
        'message.id',
        '_sender.id',
        'message.messageImage',
        'message.dropOff',
      ])
      .andWhere('message.group  = :groupId', { groupId })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
    const messageReceiver = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.users @> ARRAY[:user]::text[]', {
        user: user.id,
      })
      .andWhere('message.group  = :groupId', { groupId })
      .orderBy('message.createdAt', 'ASC')
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
      .orderBy('message.createdAt', 'ASC')
      .getMany();
    return {
      messages: messages.map((item) => item.toDto()),
      count: messages.length,
    };
  }
  private async _getOneGroup(groupId): Promise<GroupEntity> {
    return await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.messages', '_messages')
      .leftJoinAndSelect('group.groupUsers', '_groupUsers')
      .leftJoinAndSelect('_groupUsers.lastReceived', '_lastReceived')
      .leftJoinAndSelect('_groupUsers.lastRead', '_lastRead')
      .leftJoinAndSelect('_groupUsers.user', '_user')
      .where('group.id  = :groupId', { groupId })
      .orderBy('_messages.createdAt', 'ASC')
      .getOne();
  }
  async getGroup(user: UserEntity): Promise<GroupEntity[]> {
    return await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.messages', '_messages')
      .leftJoinAndSelect('group.groupUsers', '_groupUsers')
      .leftJoinAndSelect('_groupUsers.lastReceived', '_lastReceived')
      .leftJoinAndSelect('_groupUsers.lastRead', '_lastRead')
      .leftJoinAndSelect('_groupUsers.user', '_user')
      .where('_messages.users @> ARRAY[:user]::text[]', {
        user: user.id,
      })
      .orderBy('_messages.createdAt', 'ASC')
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
