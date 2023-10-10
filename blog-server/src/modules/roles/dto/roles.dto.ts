import { AbstractDto } from '@common/dto/abstract.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RoleDto extends AbstractDto {
  @Field(() => String)
  name: string;
}
