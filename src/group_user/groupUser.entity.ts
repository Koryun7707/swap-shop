import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { UserEntity } from '../user/user.entity';
import { GroupEntity } from '../group/group.entity';
import { GroupUserDto } from './dto/GroupUserDto';

@Entity({ name: 'groupUser' })
export class GroupUserEntity extends AbstractEntity<GroupUserDto> {
  @ManyToOne(() => GroupEntity, (group) => group.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group' })
  group: GroupEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user' })
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lastReceivedId' })
  lastReceivedId: string;

  @Column({ nullable: true })
  lastReceivedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lastReadId' })
  lastReadId: string;

  @Column({ nullable: true })
  lastReadAt: Date;

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

  dtoClass = GroupUserDto;
}
