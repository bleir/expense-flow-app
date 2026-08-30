import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  createCategory(createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepository.create(createCategoryDto);

    return this.categoriesRepository.save(category);
  }

  getCategories() {
    return this.categoriesRepository.find();
  }

  getCategory(id: string) {
    return this.categoriesRepository.findOneBy({ id });
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.getCategory(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updated = this.categoriesRepository.merge(
      category,
      updateCategoryDto,
    );
    return this.categoriesRepository.save(updated);
  }

  async deleteCategory(id: string) {
    const categoryToDelete = await this.getCategory(id);

    if (!categoryToDelete) {
      throw new NotFoundException('Category not found');
    }

    return this.categoriesRepository.remove(categoryToDelete);
  }
}
