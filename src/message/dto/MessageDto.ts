'use strict';

import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../common/dto/AbstractDto';
import { MessageEntity } from '../message.entity';
import { GroupEntity } from '../../group/group.entity';
import { UserEntity } from '../../user/user.entity';

export class MessageDto extends AbstractDto {
  @ApiProperty()
  group: GroupEntity;

  @ApiProperty()
  sender: UserEntity;

  @ApiProperty()
  users: string[];

  @ApiProperty()
  message: string;

  @ApiProperty()
  dropOff: string;

  @ApiProperty()
  messageImage: string[];

  constructor(messageEntity: MessageEntity) {
    super(messageEntity);
    this.group = messageEntity.group;
    this.sender = messageEntity.sender;
    this.users = messageEntity.users;
    this.message = messageEntity.message;
    this.messageImage = messageEntity.messageImage;
    this.dropOff = messageEntity.dropOff;
  }
}
