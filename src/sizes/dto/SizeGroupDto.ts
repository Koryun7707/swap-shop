'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../common/dto/AbstractDto';
import { SizeGroupEntity } from '../size_group.entity';

export class SizeGroupDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  constructor(sizeGroupEntity: SizeGroupEntity) {
    super(sizeGroupEntity);
    this.name = sizeGroupEntity.name;
  }
}
