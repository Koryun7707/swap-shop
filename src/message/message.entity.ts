import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { MessageDto } from './dto/MessageDto';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'message' })
export class MessageEntity extends AbstractEntity<MessageDto> {
  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender', referencedColumnName: 'id' })
  sender: string;

  // @ManyToOne(type => User, user => user.userRoles)
  // @JoinColumn({ name: "user_id", referencedColumnName: "id"})
  // user: User;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'receiver' })
  receiver: string;

  @Column({ nullable: false })
  message: string;

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

  dtoClass = MessageDto;
}
