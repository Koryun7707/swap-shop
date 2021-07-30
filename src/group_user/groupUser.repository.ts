import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { GroupUserEntity } from './groupUser.entity';

@EntityRepository(GroupUserEntity)
export class GroupUserRepository extends Repository<GroupUserEntity> {}
