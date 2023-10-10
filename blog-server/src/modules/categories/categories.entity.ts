import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UUIDResolver } from 'graphql-scalars';
import { AbstractEntity } from '@common/entities/abstract.entity';
import { CategoryDto } from './dto/category.dto';

@Entity({ name: 'categories' })
@ObjectType()
export class CategoryEntity extends AbstractEntity<CategoryDto> {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => UUIDResolver)
  id: string;

  @Column({ unique: true })
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  @Field(() => UUIDResolver, { description: 'Author' })
  userId: string;
}
