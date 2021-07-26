import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { SwapEntity } from './swap.entity';

@EntityRepository(SwapEntity)
export class SwapRepository extends Repository<SwapEntity> {

    async getNotificationsCount(userId : string){
      return await this
        .createQueryBuilder('swap')
        .where('swap.receiver = :userId', { userId })
        .andWhere('swap.status = :status ', {  status: 'new' })
        .getCount()
    }
}
