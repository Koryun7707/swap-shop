import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { SaveProductEntity } from './saveProduct.entity';

@EntityRepository(SaveProductEntity)
export class SaveProductRepository extends Repository<SaveProductEntity> {}
