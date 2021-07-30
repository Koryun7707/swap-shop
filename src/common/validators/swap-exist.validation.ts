import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { SwapRepository } from '../../swap/swap.repository';

@ValidatorConstraint({ name: 'SwapExist', async: true })
@Injectable()
export class SwapExistValidation implements ValidatorConstraintInterface {
  constructor(
    private swapRepository: SwapRepository,
  ) {}

  async validate(swapId: string) {
    try {
      const swap = await this.swapRepository.findOne({
        where: { id: swapId },
      });
      if (swap) {
        return true;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `swap request not found`;
  }
}
