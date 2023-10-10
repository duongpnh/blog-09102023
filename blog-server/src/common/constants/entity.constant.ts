import { registerEnumType } from '@nestjs/graphql';
import { ActionEnum } from '@common/enums/scope.enum';
import { EnumMetadataValuesMapOptions } from '@nestjs/graphql/dist/schema-builder/metadata';

export enum EntityEnum {
  AUTH = 'AUTH',
  USERS = 'USERS',
}

export const MAPPING_ENTITY_DESCRIPTION: Partial<Record<EntityEnum, EnumMetadataValuesMapOptions>> = {
  [EntityEnum.USERS]: {
    description: 'Users resource',
  },
};

registerEnumType(EntityEnum, {
  name: 'EntityEnum',
  description: 'Entities set permissions',
  valuesMap: MAPPING_ENTITY_DESCRIPTION,
});

export interface IRouteInfo {
  entity: EntityEnum;
  action: ActionEnum;
}

export const MAPPING_GQL_OPS_TO_ENTITY_ACTION: Record<string, IRouteInfo> = {
  users: {
    entity: EntityEnum.USERS,
    action: ActionEnum.READ,
  },
  updateUser: {
    entity: EntityEnum.USERS,
    action: ActionEnum.UPDATE,
  },
};

export const entitiesWillBeCheck = [EntityEnum.USERS];

export const ANONYMOUS_ROUTES = [
  {
    method: 'POST',
    routePath: '/login',
  },
  {
    method: 'POST',
    routePath: '/register',
  },
];
export const GRAPHQL_ANONYMOUS_ROUTES = [
  {
    entity: EntityEnum.AUTH,
    action: ActionEnum.LOGIN,
  },
  {
    entity: EntityEnum.AUTH,
    action: ActionEnum.REGISTER,
  },
];
