import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { RoleEntity } from './roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { ERROR } from '@common/constants/errors.constant';
import { ErrorCode } from '@common/enums/error-code.enum';
import { RoleScopeEntity } from '@role-scope/role-scope.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private _repo: Repository<RoleEntity>,
    @InjectDataSource()
    private _dataSource: DataSource,
  ) {}

  /**
   * Create a new role and attach role with scope permissions
   * @param payload an object instance of {@link CreateRoleDto}
   * @returns a value of {@link HttpStatus}
   */
  async createRole(payload: CreateRoleDto): Promise<HttpStatus> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const { manager } = queryRunner;
      const { name, permissions } = payload;

      const role = await manager.findOne(RoleEntity, {
        where: { name: ILike(name) },
      });

      if (role) {
        throw new ConflictException(ERROR[ErrorCode.ROLE_EXISTED]);
      }

      const newRole = await manager.save(RoleEntity, { name });
      // attach role with scopes
      const roleScopes = permissions.map((scopeId: number) => ({ scopeId, roleId: newRole.id }));
      await manager.insert(RoleScopeEntity, roleScopes);

      await queryRunner.commitTransaction();

      return HttpStatus.CREATED;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e);
    } finally {
      await queryRunner.release();
    }
  }
}
