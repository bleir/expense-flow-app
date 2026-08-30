import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  createCategory() {
    return 'add category';
  }

  getCategories() {
    return 'get categories';
  }

  getCategory(id: number) {
    return 'get category';
  }
}
