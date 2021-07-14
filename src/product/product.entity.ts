import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { ProductDto } from './dto/ProductDto';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'product' })
export class ProductEntity extends AbstractEntity<ProductDto> {
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  userId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  brandName: string;

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: false })
  color: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  productCondition: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  dropOff: string;

  @Column('text', { nullable: true, array: true })
  images: string[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updatedAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  dtoClass = ProductDto;
}
