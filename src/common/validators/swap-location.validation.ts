import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ProductService } from '../../product/product.service';
import { SwapLocations } from '../../enums/swap-locations';

@ValidatorConstraint({ name: 'ProductExists', async: true })
@Injectable()
export class LocationExistsRule implements ValidatorConstraintInterface {

  async validate(value: string) {
    try {
      if (SwapLocations.includes(value)) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `Location is not valid`;
  }
}
