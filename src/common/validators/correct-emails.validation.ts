import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { emails } from '../constants/emails';

@ValidatorConstraint({ name: 'CorrectEmails', async: true })
@Injectable()
export class CorrectEmails implements ValidatorConstraintInterface {
  async validate(email: string) {
    try {
      let result = false;
      emails.forEach((item) => {
        if (email.includes(item)) {
          result = true;
        }
      });
      return result;
    } catch (e) {
      return false;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `email is incorrect`;
  }
}
