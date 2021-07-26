'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../common/dto/AbstractDto';
import { ProductEntity } from '../product.entity';

export class ProductDto extends AbstractDto {
  @ApiPropertyOptional()
  user: string;

  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  brandName: string;

  @ApiPropertyOptional()
  size: string;

  @ApiPropertyOptional()
  color: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  productCondition: string;

  @ApiPropertyOptional()
  status: string;

  @ApiPropertyOptional()
  title: string;

  @ApiPropertyOptional()
  dropOff: string;

  @ApiPropertyOptional()
  images: string[];

  constructor(product: ProductEntity) {
    super(product);
    this.user = product.user;
    this.name = product.name;
    this.brandName = product.brandName;
    this.size = product.size;
    this.color = product.color;
    this.description = product.description;
    this.productCondition = product.productCondition;
    this.title    = product.title;
    this.dropOff = product.dropOff;
    this.images  = product.images;
    this.status  = product.status;
  }
}
