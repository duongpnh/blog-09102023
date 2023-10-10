import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private _repo: Repository<UserEntity>) {}

  /**
   * Get all of the users
   * @returns a list of users
   */
  async getUsers(): Promise<UserEntity[]> {
    try {
      return this._repo.find();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * Create a new user
   * @returns HttpStatus
   */
  async createUser(payload: CreateUserDto): Promise<HttpStatus> {
    try {
      await this._repo.insert(payload);

      return HttpStatus.CREATED;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
