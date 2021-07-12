import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { UserDto } from './dto/UserDto';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  postCode: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  blocked: string;

  @Column({ nullable: true })
  blockedBy: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'verified', default: false })
  verified: boolean;

  @Column({ nullable: true })
  verifiedCode: number;

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

  dtoClass = UserDto;
}
