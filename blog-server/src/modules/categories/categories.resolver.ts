import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CreateCategoryDto } from './dto/create-category.dto';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { RolesGuard } from 'src/guards/role.guard';

@Resolver()
@UseGuards(RolesGuard)
export class CategoryResolver {
  constructor(private _service: CategoryService) {}

  @Mutation(() => Int)
  async createCategory(@Args('payload') payload: CreateCategoryDto): Promise<HttpStatus> {
    return this._service.createCategory(payload);
  }
}
