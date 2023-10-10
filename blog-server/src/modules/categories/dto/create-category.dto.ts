import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateCategoryDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @Field(() => String)
  name: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  @Field(() => String, { nullable: true })
  description?: string;
}
