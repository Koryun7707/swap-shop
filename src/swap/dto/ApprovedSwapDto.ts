'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ApprovedSwapDto {

  @ApiPropertyOptional()
  @IsNotEmpty()
  id: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  dropOff: string;

}
