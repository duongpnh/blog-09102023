import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '@users/users.entity';
import { AbstractEntity } from '@common/entities/abstract.entity';
import { RoleDto } from './dto/roles.dto';
import { RoleScopeEntity } from '@role-scope/role-scope.entity';

@Entity({ name: 'roles' })
@ObjectType()
export class RoleEntity extends AbstractEntity<RoleDto> {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  name: string;

  @OneToMany(() => RoleScopeEntity, (scope) => scope.role)
  @Field(() => [RoleScopeEntity], { nullable: true })
  roleScopes: RoleScopeEntity[];

  @OneToMany(() => UserEntity, (r) => r.role)
  users: UserEntity[];
}
