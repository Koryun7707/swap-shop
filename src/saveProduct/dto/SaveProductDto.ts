'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../common/dto/AbstractDto';
import { SaveProductEntity } from '../saveProduct.entity';
import { UserEntity } from '../../user/user.entity';
import { ProductEntity } from '../../product/product.entity';

export class SaveProductDto extends AbstractDto {
  @ApiPropertyOptional()
  user: UserEntity;

  @ApiPropertyOptional()
  product: ProductEntity;

  constructor(saveProductEntity: SaveProductEntity) {
    super(saveProductEntity);
    this.user = saveProductEntity.user;
    this.product = saveProductEntity.product;
  }
}
