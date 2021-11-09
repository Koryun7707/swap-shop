import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';
import { SizesRepository } from './sizes.repository';
import { SizeSearchDto } from './dto/SizeSearchDto';
import { SizesDto } from './dto/SizesDto';

@Injectable()
export class SizesService {
  constructor(public readonly sizesRepository: SizesRepository) {}

  async searchSizes(sizeSearchDto: SizeSearchDto): Promise<SizesDto[]> {
    let searchWord = sizeSearchDto.word.toLowerCase();

    return this.sizesRepository
      .createQueryBuilder('sizes')
      .leftJoin('sizes.size_group','sizeGroup')
      .leftJoin('sizeGroup.productTypes','productTypes')
      .where(
        new Brackets((qb) => {
          qb.where('LOWER(sizes.name) like :name', {
            name: `${searchWord}%`,
          });
        }),
      )
      .andWhere('productTypes.id = :typeId',{typeId:sizeSearchDto.product_type})
      .getMany();
  }
}
