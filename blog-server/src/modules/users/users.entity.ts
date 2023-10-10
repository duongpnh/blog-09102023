import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EmailAddressResolver, UUIDResolver } from 'graphql-scalars';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserDto } from './dto/users.dto';
import { AbstractEntity } from '@common/entities/abstract.entity';
import { RoleEntity } from '@roles/roles.entity';

@ObjectType()
@Entity('users')
export class UserEntity extends AbstractEntity<UserDto> {
  @Field(() => UUIDResolver)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => EmailAddressResolver)
  @Column({ unique: true, length: 100 })
  email: string;

  @Field(() => String)
  @Column({ length: 50 })
  firstName: string;

  @Field(() => String)
  @Column({ length: 50 })
  lastName: string;

  @Field(() => String)
  @Column()
  hash: string;

  @Field(() => String)
  @Column()
  salt: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  roleId: number;

  @ManyToOne(() => RoleEntity, (e) => e.users)
  @Field(() => RoleEntity, { nullable: true })
  role: RoleEntity;
}
