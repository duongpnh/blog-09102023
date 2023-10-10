import { AbstractDto } from '@common/dto/abstract.dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RoleScopeDto extends AbstractDto {
  @Field(() => Int)
  roleId: number;

  @Field(() => Int)
  scopeId: number;
}
