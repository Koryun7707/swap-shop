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
import { GroupEntity } from '../group/group.entity';

@Entity({ name: 'message' })
export class MessageEntity extends AbstractEntity<MessageDto> {
  @ManyToOne(() => GroupEntity, (group) => group.id)
  @JoinColumn({ name: 'receiver' })
  group: GroupEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender', referencedColumnName: 'id' })
  sender: UserEntity;

  @Column('text', { nullable: true, array: true })
  users: string[];

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
