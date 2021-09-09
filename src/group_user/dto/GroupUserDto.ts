'use strict';

import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../common/dto/AbstractDto';
import { GroupUserEntity } from '../groupUser.entity';
import { UserEntity } from '../../user/user.entity';
import { GroupEntity } from '../../group/group.entity';

export class GroupUserDto extends AbstractDto {
  @ApiProperty()
  group: GroupEntity;

  @ApiProperty()
  user: UserEntity;

  @ApiProperty()
  lastReceived: UserEntity;

  @ApiProperty()
  lastReceivedAt: Date;

  @ApiProperty()
  lastRead: UserEntity;

  @ApiProperty()
  lastReadAt: Date;

  constructor(groupUserEntity: GroupUserEntity) {
    super(groupUserEntity);
    this.group = groupUserEntity.group;
    this.user = groupUserEntity.user;
    this.lastReceived = groupUserEntity.lastReceived;
    this.lastReceivedAt = groupUserEntity.lastReceivedAt;
    this.lastRead = groupUserEntity.lastRead;
    this.lastReadAt = groupUserEntity.lastReadAt;
  }
}
