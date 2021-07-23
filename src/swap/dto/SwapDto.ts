'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../common/dto/AbstractDto';
import { SwapEntity } from '../swap.entity';

export class SwapDto extends AbstractDto {

  @ApiPropertyOptional()
  sender: string;

  @ApiPropertyOptional()
  receiver: string;

  @ApiPropertyOptional()
  senderProduct: string;

  @ApiPropertyOptional()
  receiverProduct: string;

  @ApiPropertyOptional()
  dropOff: string[];

  @ApiPropertyOptional()
  status: string;

  constructor(swap: SwapEntity) {
    super(swap)
    this.sender          = swap.sender;
    this.receiver        = swap.receiver;
    this.senderProduct   = swap.senderProduct;
    this.receiverProduct = swap.receiverProduct;
    this.dropOff         = swap.dropOff;
    this.status          = swap.status;
  }
}
