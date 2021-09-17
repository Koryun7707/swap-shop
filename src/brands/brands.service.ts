import { Injectable } from '@nestjs/common';
import { BrandsRepository } from './brands.repository';
import { UserEntity } from '../user/user.entity';
import { Brackets } from 'typeorm';
import { BrandsDto } from './dto/BrandsDto';

@Injectable()
export class BrandsService {
  constructor(public readonly brandsRepository: BrandsRepository) {}
  async searchBrands(user: UserEntity, search?: string): Promise<BrandsDto[]> {
    search = search.toLowerCase();
    return this.brandsRepository
      .createQueryBuilder('brands')
      .where(
        new Brackets((qb) => {
          qb.where('LOWER(brands.name) like :name', {
            name: `${search}%`,
          });
        }),
      )
      .getMany();
  }
}
