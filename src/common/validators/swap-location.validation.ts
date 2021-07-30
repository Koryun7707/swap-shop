import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { SwapLocations } from '../../enums/swap-locations';

@ValidatorConstraint({ name: 'ProductExists', async: true })
@Injectable()
export class LocationExistsRule implements ValidatorConstraintInterface {
  async validate(value: Array<string>) {
    try {
      value.forEach((item) => {
        if (!SwapLocations.includes(item)) {
          return `Location ${item} is not valid`;
        }
      });
    } catch (e) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Location is not valid`;
  }
}
