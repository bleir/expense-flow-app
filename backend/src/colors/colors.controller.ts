import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto.js';
import { ColorsService } from './colors.service.js';
import { UpdateColorDto } from './dto/update-color.dto.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/current-user.decorator.js';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  createColor(
    @Body() createColorDto: CreateColorDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.colorsService.createColor(createColorDto, user.id);
  }

  @Get()
  getColors(@CurrentUser() user: AuthenticatedUser) {
    return this.colorsService.getColors(user.id);
  }

  @Get(':id')
  getColor(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.colorsService.getColor(id, user.id);
  }

  @Patch(':id')
  updateColor(
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.colorsService.updateColor(id, updateColorDto, user.id);
  }

  @Delete(':id')
  deleteColor(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.colorsService.deleteColor(id, user.id);
  }
}
