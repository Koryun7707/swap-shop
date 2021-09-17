'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../common/dto/AbstractDto';
import { BrandsEntity } from '../brands.entity';

export class BrandsDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  constructor(brandsEntity: BrandsEntity) {
    super(brandsEntity);
    this.name = brandsEntity.name;
  }
}
