import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, UsersResolver],
  controllers: [UsersController],
})
export class UsersModule {}
