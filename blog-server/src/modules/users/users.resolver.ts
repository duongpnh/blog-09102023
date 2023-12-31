import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from './users.entity';
import { UsersService } from './users.service';
import { UserDto } from './dto/users.dto';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from 'src/guards/role.guard';

@Resolver()
@UseGuards(RolesGuard)
export class UsersResolver {
  constructor(private _service: UsersService) {}

  @Query(() => [UserDto])
  getUsers(): Promise<UserEntity[]> {
    return this._service.getUsers();
  }

  @Mutation(() => Int)
  createUser(@Args('payload') payload: CreateUserDto): Promise<HttpStatus> {
    return this._service.createUser(payload);
  }
}
