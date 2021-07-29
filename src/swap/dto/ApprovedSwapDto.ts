'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { SwapExistValidation } from '../../common/validators/swap-exist.validation';

export class ApprovedSwapDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @Validate(SwapExistValidation)
  id: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  dropOff: string;
}
