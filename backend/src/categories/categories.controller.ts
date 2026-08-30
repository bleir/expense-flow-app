import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  createCategory() {
    return this.categoriesService.createCategory();
  }

  @Get()
  getCategories() {
    return this.categoriesService.getCategories();
  }

  @Get(':id')
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getCategory(id);
  }
}
