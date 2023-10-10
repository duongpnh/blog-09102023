import { AbstractDto } from '@common/dto/abstract.dto';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryDto extends AbstractDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
