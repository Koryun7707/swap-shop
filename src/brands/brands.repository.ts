import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { BrandsEntity } from './brands.entity';

@EntityRepository(BrandsEntity)
export class BrandsRepository extends Repository<BrandsEntity> {}
