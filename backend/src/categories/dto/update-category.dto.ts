import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-categories.dto.js';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
