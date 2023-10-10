import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { ContextService } from '@providers/context.service';
import { ContextType } from '@common/enums/context-type.enum';
import {
  ANONYMOUS_ROUTES,
  GRAPHQL_ANONYMOUS_ROUTES,
  IRouteInfo,
  MAPPING_GQL_OPS_TO_ENTITY_ACTION,
} from '@common/constants/entity.constant';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { ERROR } from '@common/constants/errors.constant';
import { ConfigService } from '@config/config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@users/users.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    @InjectRepository(UserEntity)
    private _userRepo: Repository<UserEntity>,
    private _configService: ConfigService,
    private _jwtService: JwtService,
  ) {}

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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this._reflector.get<boolean>('Public', context.getHandler());
    const isBasicAuth = this._reflector.get<boolean>('basic', context.getHandler());

    if (isPublic) return true;

    if (isBasicAuth) return true;

    let request;
    let isPublicRoute;

    if (context.getType() === ContextType.HTTP) {
      request = context.switchToHttp().getRequest();
      const { method, route } = request;

      isPublicRoute = ANONYMOUS_ROUTES.some(
        (anonymousRoute) => anonymousRoute.method === method && anonymousRoute.routePath === route.path,
      );
    } else if (context.getType<GqlContextType>() === ContextType.GRAPHQL) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
      const gplInfo = ctx.getInfo();
      const entityInfo = this.determineEntityInGQL(gplInfo);

      isPublicRoute = GRAPHQL_ANONYMOUS_ROUTES.some(
        (anonymousRoute) =>
          anonymousRoute.action === entityInfo?.action && anonymousRoute.entity === entityInfo?.entity,
      );
    }

    const token = (request.headers.authorization || '').split(' ')?.[1];

    if (isPublicRoute && !token) {
      return true;
    }

    const { jwtConfig } = this._configService;

    jwt.verify(token, jwtConfig.key, { algorithms: ['RS256'] }, (err: VerifyErrors, decodedToken: JwtPayload) => {
      if (err) throw new UnauthorizedException(ERROR[ErrorCode.TOKEN_EXPIRES]);
      return decodedToken;
    });

    // const decodeToken: any = this._jwtService.decode(token, { complete: true });

    // Check user already exist on cognito
    // const user = await this._userRepo.findOne({
    //   where: { id: decodeToken?.id },
    //   relations: ['role', 'role.roleScopes', 'role.roleScopes.scope'],
    // });

    // if (!user) {
    //   throw new NotFoundException(ERROR[ErrorCode.INVALID_CREDENTIALS]);
    // }

    // const { role } = user;
    // const { roleScopes } = role;

    // const scopes = (roleScopes || []).map(({ scope }) => {
    //   return scope;
    // });

    // ContextService.setScopePermissions(scopes);

    return true;
  }
}
