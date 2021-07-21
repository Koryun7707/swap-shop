'use strict';

import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../common/dto/AbstractDto';
import { MessageEntity } from '../message.entity';

export class MessageDto extends AbstractDto {
  @ApiProperty()
  sender: string;

  @ApiProperty()
  receiver: string;

  @ApiProperty()
  message: string;

  constructor(messageEntity: MessageEntity) {
    super(messageEntity);
    this.sender = messageEntity.sender;
    this.receiver = messageEntity.receiver;
    this.message = messageEntity.message;
  }
}
