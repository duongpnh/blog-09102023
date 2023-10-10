import { Module } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CategoryResolver } from './categories.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './categories.entity';
import { UserEntity } from '@users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, UserEntity])],
  providers: [CategoryService, CategoryResolver],
})
export class CategoryModule {}
