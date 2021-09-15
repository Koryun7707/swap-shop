'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../common/dto/AbstractDto';
import { ProductTypesEntity } from '../productTypes.entity';

export class ProductTypesDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  constructor(productTypes: ProductTypesEntity) {
    super(productTypes);
    this.name = productTypes.name;
  }
}
