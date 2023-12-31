import { registerEnumType } from '@nestjs/graphql';
import { ActionEnum } from '@scopes/enums/action.enum';
import { EnumMetadataValuesMapOptions } from '@nestjs/graphql/dist/schema-builder/metadata';

export enum EntityEnum {
  AUTH = 'AUTH',
  USERS = 'USERS',
  ROLES = 'ROLES',
  CATEGORIES = 'CATEGORIES',
}

export const MAPPING_ENTITY_DESCRIPTION: Partial<Record<EntityEnum, EnumMetadataValuesMapOptions>> = {
  [EntityEnum.USERS]: {
    description: 'Users resource',
  },
  [EntityEnum.ROLES]: {
    description: 'Roles resource',
  },
  [EntityEnum.CATEGORIES]: {
    description: 'Categories resource',
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
  getUsers: {
    entity: EntityEnum.USERS,
    action: ActionEnum.READ,
  },
  updateUser: {
    entity: EntityEnum.USERS,
    action: ActionEnum.UPDATE,
  },
  createCategory: {
    entity: EntityEnum.CATEGORIES,
    action: ActionEnum.CREATE,
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
