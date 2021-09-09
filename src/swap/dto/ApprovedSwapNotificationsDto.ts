'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { UserExistsRule } from '../../common/validators/user-exist.validation';

export class ApprovedSwapNotificationsDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @Validate(UserExistsRule)
  receiver: string;

  @ApiPropertyOptional()
  @IsOptional()
  offset: number;

  @ApiPropertyOptional()
  @IsOptional()
  limit: number;
}
