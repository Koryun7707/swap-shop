import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { ProductTypesEntity } from './productTypes.entity';

@EntityRepository(ProductTypesEntity)
export class ProductTypesRepository extends Repository<ProductTypesEntity> {}
