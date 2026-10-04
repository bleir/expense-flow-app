import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './category.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-categories.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto, userId: string) {
    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      user: { id: userId },
    });
    const saved = await this.categoriesRepository.save(category);
    const { user: _user, ...result } = saved;

    return result;
  }

  getCategories(userId: string) {
    return this.categoriesRepository.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
  }

  async getCategory(id: string, userId: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ) {
    const category = await this.getCategory(id, userId);
    const updated = this.categoriesRepository.merge(
      category,
      updateCategoryDto,
    );
    return this.categoriesRepository.save(updated);
  }

  async deleteCategory(id: string, userId: string) {
    const categoryToDelete = await this.getCategory(id, userId);

    return this.categoriesRepository.remove(categoryToDelete);
  }
}
