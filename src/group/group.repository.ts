import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { GroupEntity } from './group.entity';

@EntityRepository(GroupEntity)
export class GroupRepository extends Repository<GroupEntity> {}
