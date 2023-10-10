import { Module } from '@nestjs/common';
import { ScopesResolver } from './scopes.resolver';
import { ScopesService } from './scopes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScopeEntity } from './scopes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScopeEntity])],
  providers: [ScopesResolver, ScopesService],
})
export class ScopesModule {}
