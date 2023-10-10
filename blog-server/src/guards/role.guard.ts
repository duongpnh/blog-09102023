import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityEnum,
  GRAPHQL_ANONYMOUS_ROUTES,
  IRouteInfo,
  MAPPING_GQL_OPS_TO_ENTITY_ACTION,
} from '@common/constants/entity.constant';
import { ContextService } from '../providers/context.service';
import { UserEntity } from '@users/users.entity';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ActionEnum } from '@scopes/enums/action.enum';
import { JwtService } from '@nestjs/jwt';

interface IPropsCheckPermissionByAction {
  entity: string;
  params: any;
  action: string;
  userScopes: Record<string, any>[];
  gplInfo?: any;
  authId?: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepo: Repository<UserEntity>,
    private _jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request;
    let gqlInfo;

    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
      gqlInfo = ctx.getInfo();
    } else {
      return true;
    }

    return this.checkUserPermissionGQL(request, gqlInfo);
  }

  determineEntityInGQL(gqlInfo: any): IRouteInfo | null {
    const { key } = gqlInfo.path;
    const routeInfo = MAPPING_GQL_OPS_TO_ENTITY_ACTION[key];

    if (!routeInfo) {
      return null;
    }

    const { entity } = routeInfo;
    ContextService.setEntity(entity);

    return routeInfo;
  }

  async getListRoleIdByUserId(userId: string): Promise<number[]> {
    const userRoleCondition = {
      where: { id: userId },
      withDeleted: true,
    } as FindManyOptions<unknown>;
    try {
      const user = await this._userRepo.findOne(userRoleCondition);

      return [+user.roleId];
    } catch (_) {
      return [];
    }
  }

  checkRolePermissionByUserId(entity, action, roleIds = [], userScopes = []): boolean {
    // get list scopes of user
    const isValidScopeBasedOnEntity = userScopes.some((scope) => scope.entity === entity && scope.action === action);

    // if (entity === EntityEnum.USERS) {
    //   const isValidScopeBasedRoles =
    //     roleIds.length > 0 &&
    //     roleIds.every((role) =>
    //       userScopes.some(
    //         (scope) =>
    //           (+scope?.roleId === +role || +scope?.roleApplied === +role) &&
    //           scope.entity === entity &&
    //           scope.action === action,
    //       ),
    //     );

    //   console.log({ isValidScopeBasedOnEntity, isValidScopeBasedRoles, roleIds });

    //   return isValidScopeBasedOnEntity && isValidScopeBasedRoles;
    // }

    return isValidScopeBasedOnEntity;
  }

  async checkPermissionByAction(props: IPropsCheckPermissionByAction) {
    let isPassed = false;
    const { entity, params, gplInfo, action, userScopes, authId } = props;

    if (entity === EntityEnum.USERS) {
      let { id } = params;

      if (gplInfo) {
        id = gplInfo.variableValues.id;
      }

      if (!id && authId) {
        id = authId;
      }

      const rolesIds = await this.getListRoleIdByUserId(id);

      isPassed = this.checkRolePermissionByUserId(entity, action, rolesIds, userScopes);

      return isPassed;
    }

    isPassed = this.checkRolePermissionByUserId(entity, action, [], userScopes);

    return isPassed;
  }

  decodeAuthToken(token: string): any {
    const fullToken = token.replace('Bearer ', '');
    return this._jwtService.decode(fullToken, { json: true });
  }

  async checkUserPermissionGQL(request: any, gplInfo: any) {
    const {
      headers: { authorization },
    } = request;
    const entityInfo = this.determineEntityInGQL(gplInfo);

    let isPassed = false;

    isPassed = GRAPHQL_ANONYMOUS_ROUTES.some(
      (anonymousRoute) => anonymousRoute.action === entityInfo?.action && anonymousRoute.entity === entityInfo?.entity,
    );

    if (isPassed && !authorization) {
      return true;
    }

    if (!authorization) {
      return false;
    }

    const { entity, action } = entityInfo;

    const decodedToken = this.decodeAuthToken(authorization);

    const userScopes = ContextService.getScopePermissions();

    switch (action) {
      case ActionEnum.READ: {
        const {
          params: { id },
        } = request;

        const { roles } = gplInfo?.variableValues?.queryParams || {};

        if (!roles && entity !== EntityEnum.USERS) {
          isPassed = this.checkRolePermissionByUserId(entity, action, [], userScopes);

          return isPassed;
        }

        if (!roles && id && entity === EntityEnum.USERS) {
          const rolesIds = await this.getListRoleIdByUserId(id);

          isPassed = this.checkRolePermissionByUserId(entity, action, rolesIds, userScopes);

          return isPassed;
        }

        if (Array.isArray(roles) && roles.length === 0) {
          return isPassed;
        }

        isPassed = this.checkRolePermissionByUserId(entity, action, roles || [], userScopes);

        return isPassed;
      }

      case ActionEnum.CREATE: {
        const { body } = request;
        const { payload } = body.variables;

        const roles = payload?.role ? [payload.role] : undefined;

        console.log({
          roles,
          entity,
          a: !roles && entity !== EntityEnum.USERS,
          isPassed,
        });

        if (!roles && entity !== EntityEnum.USERS) {
          console.log({ isPassed1: isPassed });
          isPassed = this.checkRolePermissionByUserId(entity, action, [], userScopes);

          return isPassed;
        }

        if (Array.isArray(roles) && roles.length === 0) {
          return isPassed;
        }

        isPassed = this.checkRolePermissionByUserId(entity, action, roles, userScopes);

        return isPassed;
      }

      case ActionEnum.RESTORE:
      case ActionEnum.UPDATE:
      case ActionEnum.DELETE: {
        const { params } = request;
        const authId = decodedToken.sub;
        isPassed = await this.checkPermissionByAction({
          entity,
          params,
          action,
          userScopes,
          gplInfo,
          authId,
        });

        return isPassed;
      }

      default:
        return isPassed;
    }
  }
}
