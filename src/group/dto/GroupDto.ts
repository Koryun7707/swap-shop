'use strict';

import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../common/dto/AbstractDto';
import { GroupEntity } from '../group.entity';
import { GroupEnum } from '../../enums/group.enum';

export class GroupDto extends AbstractDto {
  @ApiProperty()
  type: GroupEnum;

  @ApiProperty()
  name: string;

  constructor(groupEntity: GroupEntity) {
    super(groupEntity);
    this.type = groupEntity.type;
    this.name = groupEntity.name;
  }
}
