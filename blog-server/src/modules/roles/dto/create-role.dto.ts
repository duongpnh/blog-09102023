import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateRoleDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @Field(() => String)
  name: string;

  @Field(() => [Int])
  permissions: number[];
}
