import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { ProductEntity } from './product.entity';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {

  async findValidUserProduct(userId:string,productId:string) : Promise<ProductEntity>{
      return await this.findOne({
        id: productId,
        user: userId,
      })
  }

}
