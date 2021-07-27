import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    const groupUserModel = await this.groupUserRepository.create({
      group,
      user,
    });
    await this.groupUserRepository.save(groupUserModel);
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
      .where('message.receiver = :receiver', { receiver: receiverId })
      .andWhere('message.sender = :sender', { sender: user.id })
      .offset(offset)
      .limit(limit)
      .orderBy('message.createdAt', 'DESC')
      .getMany();
    return {
      messages: messages.map((item) => item.toDto()),
      count: await this._getCount(user, receiverId),
    };
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
  private async _getCount(
    user: UserEntity,
    receiverId: string,
  ): Promise<number> {
    return this.messageRepository
      .createQueryBuilder('message')
      .where('message.receiver = :receiver', { receiver: receiverId })
      .andWhere('message.sender = :sender', { sender: user.id })
      .getCount();
  }
}
