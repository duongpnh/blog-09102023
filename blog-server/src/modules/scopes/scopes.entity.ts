import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AbstractEntity } from '@common/entities/abstract.entity';
import { ActionEnum } from './enums/action.enum';
import { ScopeDto } from './dto/scope.dto';
import { RoleScopeEntity } from '../role-scope/role-scope.entity';
import { EntityEnum } from '@common/constants/entity.constant';

@Entity({ name: 'scopes' })
@ObjectType()
export class ScopeEntity extends AbstractEntity<ScopeDto> {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description: string;

  @Column({ nullable: true, type: 'enum', enum: ActionEnum })
  @Field(() => ActionEnum, { nullable: true })
  action: ActionEnum;

  @Column({ nullable: true, type: 'enum', enum: EntityEnum })
  @Field(() => EntityEnum, { nullable: true })
  entity: EntityEnum;

  @Column({ nullable: true, type: 'int4' })
  @Field(() => Int, { nullable: true })
  roleIdApplied: number;

  @OneToMany(() => RoleScopeEntity, (roleScope) => roleScope.scope)
  roleScopes!: RoleScopeEntity[];
}
