import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { ProductTypesDto } from './dto/ProductTypesDto';
import { ProductDto } from '../product/dto/ProductDto';
import { SizeGroupEntity } from '../sizes/size_group.entity';

@Entity({ name: 'productTypes' })
export class ProductTypesEntity extends AbstractEntity<ProductTypesDto> {
  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => SizeGroupEntity, sizeGroup => sizeGroup.productTypes)
  size_group: SizeGroupEntity;

  dtoClass = ProductDto;
}
