import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ActionEnum } from '@scopes/enums/action.enum';
import { EntityEnum } from '@common/constants/entity.constant';

@InputType()
export class CreateScopeDto {
  @IsString({ message: 'name must be a string' })
  @Field(() => String)
  name: string;

  @IsEnum(ActionEnum)
  @Field(() => ActionEnum)
  action: ActionEnum;

  @IsEnum(EntityEnum)
  @Field(() => EntityEnum)
  entity: EntityEnum;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  roleIdApplied?: number;
}
