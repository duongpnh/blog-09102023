import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScopeEntity } from './scopes.entity';
import { ILike, Repository } from 'typeorm';
import { CreateScopeDto } from './dto/create-scope.dto';
import { ERROR } from '@common/constants/errors.constant';
import { ErrorCode } from '@common/enums/error-code.enum';

@Injectable()
export class ScopesService {
  constructor(
    @InjectRepository(ScopeEntity)
    private _repo: Repository<ScopeEntity>,
  ) {}

  /**
   * Create a new scope
   * @param payload an object instance of {@link CreateRoleDto}
   * @returns a value of {@link HttpStatus}
   */
  async createScope(payload: CreateScopeDto): Promise<HttpStatus> {
    try {
      const { name } = payload;

      const scope = await this._repo.findOne({
        where: { name: ILike(name) },
      });

      if (scope) {
        throw new ConflictException(ERROR[ErrorCode.SCOPE_EXISTED]);
      }

      await this._repo.insert(payload);

      return HttpStatus.CREATED;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
