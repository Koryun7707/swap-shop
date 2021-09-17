import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { BrandsDto } from './dto/BrandsDto';

@Entity({ name: 'brands' })
export class BrandsEntity extends AbstractEntity<BrandsDto> {
  @Column({ nullable: false })
  name: string;

  dtoClass = BrandsDto;
}
