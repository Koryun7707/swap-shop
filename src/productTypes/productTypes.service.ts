import { Injectable } from '@nestjs/common';
import { ProductTypesRepository } from './productTypes.repository';
import { UserEntity } from '../user/user.entity';
import { Brackets } from 'typeorm';
import { ProductTypesDto } from './dto/ProductTypesDto';

@Injectable()
export class ProductTypesService {
  constructor(public readonly productTypesRepository: ProductTypesRepository) {}
  async searchProductTypes(
    user: UserEntity,
    search?: string,
  ): Promise<ProductTypesDto[]> {
    search = search.toLowerCase();
    return this.productTypesRepository
      .createQueryBuilder('productTypes')
      .where(
        new Brackets((qb) => {
          qb.where('LOWER(productTypes.name) like :name', {
            name: `${search}%`,
          });
        }),
      )
      .getMany();
  }
}
