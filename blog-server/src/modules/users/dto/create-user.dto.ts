import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { EmailAddressResolver } from 'graphql-scalars';

@InputType()
export class CreateUserDto {
  @IsString()
  @Field(() => EmailAddressResolver)
  email: string;

  @IsString()
  @Field(() => String)
  firstName: string;

  @IsString()
  @Field(() => String)
  lastName: string;

  @IsString()
  @Field(() => String)
  hash: string;

  @IsString()
  @Field(() => String)
  salt: string;
}
