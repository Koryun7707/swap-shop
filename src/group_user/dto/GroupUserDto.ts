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
  lastReceivedId: string;

  @ApiProperty()
  lastReceivedAt: Date;

  @ApiProperty()
  lastReadId: string;

  @ApiProperty()
  lastReadAt: Date;

  constructor(groupUserEntity: GroupUserEntity) {
    super(groupUserEntity);
    this.group = groupUserEntity.group;
    this.user = groupUserEntity.user;
    this.lastReceivedId = groupUserEntity.lastReceivedId;
    this.lastReceivedAt = groupUserEntity.lastReceivedAt;
    this.lastReadId = groupUserEntity.lastReadId;
    this.lastReadAt = groupUserEntity.lastReadAt;
  }
}
