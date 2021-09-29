import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { StoreTokenEntity } from './storeToken.entity';

@EntityRepository(StoreTokenEntity)
export class StoreTokenRepository extends Repository<StoreTokenEntity> {}
