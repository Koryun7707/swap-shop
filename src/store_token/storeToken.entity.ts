import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { StoreTokenDto } from './dto/StoreTokenDto';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'storeToken' })
export class StoreTokenEntity extends AbstractEntity<StoreTokenDto> {
  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  userId: string;

  @Column({ nullable: false })
  token: string;

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

  dtoClass = StoreTokenDto;
}
