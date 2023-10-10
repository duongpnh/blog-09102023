import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { ScopesService } from './scopes.service';
import { CreateScopeDto } from './dto/create-scope.dto';
import { HttpStatus } from '@nestjs/common';

@Resolver()
export class ScopesResolver {
  constructor(private _service: ScopesService) {}

  @Mutation(() => Int)
  async createScope(@Args('payload') payload: CreateScopeDto): Promise<HttpStatus> {
    return this._service.createScope(payload);
  }
}
