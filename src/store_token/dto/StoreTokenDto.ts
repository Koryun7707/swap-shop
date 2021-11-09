'use strict';

import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../common/dto/AbstractDto';
import { StoreTokenEntity } from '../storeToken.entity';

export class StoreTokenDto extends AbstractDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  token: string;

  constructor(storeTokenEntity: StoreTokenEntity) {
    super(storeTokenEntity);
    this.userId = storeTokenEntity.userId;
    this.token = storeTokenEntity.token;
  }
}
