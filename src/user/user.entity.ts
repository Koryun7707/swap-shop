import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { UserDto } from './dto/UserDto';

@Entity({ name: 'user' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ default: '', nullable: true })
  firstName: string;

  @Column({ default: '', nullable: true })
  lastName: string;

  @Column({ default: '', nullable: true })
  address1: string;

  @Column({ default: '', nullable: true })
  address2: string;

  @Column({ default: '', nullable: true })
  gender: string;

  @Column({ default: '', nullable: true })
  postCode: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: '', nullable: true })
  profilePicture: string;

  @Column({ default: '', nullable: true })
  age: string;

  @Column('text', { nullable: true, array: true })
  blocked: string[];

  @Column('text', { nullable: true, array: true })
  blockedBy: string[];

  @Column({ default: '', nullable: true })
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
