import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { GroupDto } from './dto/GroupDto';
import { GroupEnum } from '../enums/group.enum';

@Entity({ name: 'group' })
export class GroupEntity extends AbstractEntity<GroupDto> {
  @Column({
    type: 'enum',
    enum: GroupEnum,
    default: GroupEnum.DM,
  })
  public type: GroupEnum;

  @Column({ nullable: true })
  name: string;

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
