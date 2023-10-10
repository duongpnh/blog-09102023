import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './categories.entity';
import { ILike, Repository } from 'typeorm';
import { ERROR } from '@common/constants/errors.constant';
import { ErrorCode } from '@common/enums/error-code.enum';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ContextService } from '@providers/context.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private _repo: Repository<CategoryEntity>,
  ) {}

  async createCategory(payload: CreateCategoryDto): Promise<HttpStatus> {
    try {
      const userId = ContextService.getAuthUser();
      const { name } = payload;
      const category = await this._repo.findOne({
        where: {
          name: ILike(name),
        },
      });

      if (category) {
        throw new ConflictException(ERROR[ErrorCode.CATEGORY_EXISTED]);
      }

      await this._repo.insert({
        ...payload,
        userId,
      });

      return HttpStatus.CREATED;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
