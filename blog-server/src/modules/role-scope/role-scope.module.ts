import { Module } from '@nestjs/common';
import { RoleScopeResolver } from './role-scope.resolver';
import { RoleScopeService } from './role-scope.service';

@Module({
  providers: [RoleScopeResolver, RoleScopeService]
})
export class RoleScopeModule {}
