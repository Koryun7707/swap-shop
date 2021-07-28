import { In, Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { ProductEntity } from './product.entity';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async checkProductsUser(
    userId: string,
    products: Array<ProductEntity>,
  ): Promise<ProductEntity[]> {
    const product = await this.find({
      where: {
        id: In(products),
        user: userId,
      },
    });
    if (product.length === products.length) {
      return product;
    }
    return [];
  }
}
