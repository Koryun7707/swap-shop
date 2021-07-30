'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { UserExistsRule } from '../../common/validators/user-exist.validation';
import { ProductExistsRule } from '../../common/validators/product-exist.validation';
import { SwapStatusesEnum } from '../../enums/swap-statuses.enum';
import { LocationExistsRule } from '../../common/validators/swap-location.validation';
import { ProductEntity } from '../../product/product.entity';

export class CreateSwapDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @Validate(UserExistsRule)
  receiver: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Validate(ProductExistsRule)
  senderProduct: ProductEntity[];

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Validate(ProductExistsRule)
  receiverProduct: ProductEntity[];

  @IsOptional()
  @ApiProperty()
  @Validate(LocationExistsRule)
  dropOff: string[];

  @IsOptional()
  @ApiProperty({ enum: SwapStatusesEnum })
  @IsEnum(SwapStatusesEnum)
  public status: SwapStatusesEnum;
}
