import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ProductEntity } from '../product/product.entity';
import { AbstractEntity } from '../common/abstract.entity';
import { SwapDto } from './dto/SwapDto';
import { SwapStatusesEnum } from '../enums/swap-statuses.enum';

@Entity({ name: 'swap' })
export class SwapEntity extends AbstractEntity<SwapDto> {
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender' })
  sender: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver' })
  receiver: string;

  @ManyToMany(() => ProductEntity)
  @JoinTable()
  senderProduct: ProductEntity[];

  @ManyToMany(() => ProductEntity)
  @JoinTable()
  receiverProduct: ProductEntity[];

  @Column({ type: 'simple-array', nullable: false })
  dropOff: string[];

  @Column({
    type: 'enum',
    enum: SwapStatusesEnum,
    default: SwapStatusesEnum.NEW,
  })
  public status: SwapStatusesEnum;

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

  dtoClass = SwapDto;
}
