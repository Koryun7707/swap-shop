import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { SizesEntity } from './sizes.entity';


@EntityRepository(SizesEntity)
export class SizesRepository extends Repository<SizesEntity> {}
