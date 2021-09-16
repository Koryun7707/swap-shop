import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { GroupDto } from './dto/GroupDto';
import { GroupEnum } from '../enums/group.enum';
import { MessageEntity } from '../message/message.entity';
import { GroupUserEntity } from '../group_user/groupUser.entity';

@Entity({ name: 'group' })
export class GroupEntity extends AbstractEntity<GroupDto> {
  @Column({
    type: 'enum',
    enum: GroupEnum,
    default: GroupEnum.DM,
  })
  public type: GroupEnum;

  @OneToOne(() => MessageEntity, (message) => message.group)
  lastMessage: string;

  @OneToMany(() => GroupUserEntity, (groupUser) => groupUser.group)
  groupUsers: GroupUserEntity[];

  @Column('uuid', { nullable: true, array: true })
  users: string[];

  @Column({ nullable: true })
  name: string;

  @Column({
    nullable: true,
  })
  lastMessageViewer: string;

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

  dtoClass = GroupDto;
}
