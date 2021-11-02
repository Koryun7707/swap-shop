import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { SizesDto } from './dto/SizesDto';
import { SizeGroupEntity } from './size_group.entity';

@Entity({ name: 'sizes' })
export class SizesEntity extends AbstractEntity<SizesDto> {

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => SizeGroupEntity, sizeGroup => sizeGroup.sizes)
  size_group: SizesEntity;

  dtoClass = SizesDto;
}
