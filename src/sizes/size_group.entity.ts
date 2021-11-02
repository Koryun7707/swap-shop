import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { SizeGroupDto } from './dto/SizeGroupDto';
import { SizesEntity } from './sizes.entity';
import { ProductTypesEntity } from '../productTypes/productTypes.entity';

@Entity({ name: 'size_group' })
export class SizeGroupEntity extends AbstractEntity<SizeGroupDto> {

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => SizesEntity, size => size.size_group)
  sizes: SizesEntity[];

  @OneToMany(() => ProductTypesEntity, productType => productType.size_group)
  productTypes: ProductTypesEntity[];

  dtoClass = SizeGroupDto;
}
