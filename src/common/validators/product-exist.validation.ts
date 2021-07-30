import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ProductService } from '../../product/product.service';
import { ProductRepository } from '../../product/product.repository';
import { In } from 'typeorm';
import { ProductEntity } from '../../product/product.entity';

@ValidatorConstraint({ name: 'ProductExists', async: true })
@Injectable()
export class ProductExistsRule implements ValidatorConstraintInterface {
  constructor(
    private productService: ProductService,
    private productRepository: ProductRepository,
  ) {}

  async validate(products: Array<ProductEntity>) {
    try {
      const count = await this.productRepository.count({
        where: { id: In(products) },
      });
      if (count === products.length) {
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
