'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SizeSearchDto {
  @ApiPropertyOptional()
  word: string = '';

  @ApiPropertyOptional()
  @IsNotEmpty()
  product_type: string;
}
