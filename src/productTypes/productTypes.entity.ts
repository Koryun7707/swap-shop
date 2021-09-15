import {
  Column,
  Entity,
} from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { ProductTypesDto } from './dto/ProductTypesDto';
import { ProductDto } from '../product/dto/ProductDto';

@Entity({ name: 'productTypes' })
export class ProductTypesEntity extends AbstractEntity<ProductTypesDto> {
  @Column({ nullable: false })
  name: string;

  dtoClass = ProductDto;
}
