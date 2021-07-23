import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ProductService } from '../../product/product.service';

@ValidatorConstraint({ name: 'ProductExists', async: true })
@Injectable()
export class ProductExistsRule implements ValidatorConstraintInterface {

  constructor(private productService: ProductService) {
  }

  async validate(value: string) {
    try {
      const row = await this.productService.findProductById(value);
      if (row) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `product not found`;
  }
}
