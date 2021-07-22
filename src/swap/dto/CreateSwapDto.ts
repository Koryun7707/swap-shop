'use strict';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { UserExistsRule } from '../../common/validators/user-exist.validation';
import { ProductExistsRule } from '../../common/validators/product-exist.validation';
import { ProductConditionsEnum } from '../../enums/product-conditions.enum';
import { SwapStatusesEnum } from '../../enums/swap-statuses.enum';

export class CreateSwapDto {

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Validate(UserExistsRule)
  receiver: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Validate(ProductExistsRule)
  senderProduct: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Validate(ProductExistsRule)
  receiverProduct: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  dropOff: string[];

  @IsOptional()
  @ApiProperty({ enum: SwapStatusesEnum })
  @IsEnum(SwapStatusesEnum)
  public status: SwapStatusesEnum;
}
