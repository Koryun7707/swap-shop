'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { UserExistsRule } from '../../common/validators/user-exist.validation';

export class ApprovedSwapNotificationsDto {

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Validate(UserExistsRule)
  sender: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Validate(UserExistsRule)
  receiver: string;

  offset: number = 0;

  limit: number = 10;
}
