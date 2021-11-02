'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../common/dto/AbstractDto';
import { SizesEntity } from '../sizes.entity';


export class SizesDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  constructor(sizeEntity: SizesEntity) {
    super(sizeEntity);
    this.name = sizeEntity.name;
  }
}
