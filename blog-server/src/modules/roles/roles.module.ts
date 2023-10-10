import { Module } from '@nestjs/common';
import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleScopeEntity } from '@role-scope/role-scope.entity';
import { RoleEntity } from './roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, RoleScopeEntity])],
  providers: [RolesResolver, RolesService],
})
export class RolesModule {}
