import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@common/entities/abstract.entity';
import { RoleScopeDto } from './dto/role-scope.dto';
import { RoleEntity } from '@roles/roles.entity';
import { ScopeEntity } from '@scopes/scopes.entity';

@Entity({ name: 'role_scope' })
@ObjectType()
export class RoleScopeEntity extends AbstractEntity<RoleScopeDto> {
  @PrimaryColumn({ type: 'int4' })
  @Field(() => Int)
  roleId: number;

  @PrimaryColumn({ type: 'int4' })
  @Field(() => Int)
  scopeId: number;

  @ManyToOne(() => ScopeEntity, (scope) => scope.roleScopes)
  @JoinColumn({ name: 'scope_id' })
  @Field(() => ScopeEntity)
  scope: ScopeEntity;

  @ManyToOne(() => RoleEntity, (role) => role.roleScopes)
  role: RoleEntity;
}
