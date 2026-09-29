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

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  createColor(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.createColor(createColorDto);
  }

  @Get()
  getColors() {
    return this.colorsService.getColors();
  }

  @Get(':id')
  getColor(@Param('id') id: string) {
    return this.colorsService.getColor(id);
  }

  @Patch(':id')
  updateColor(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorsService.updateColor(id, updateColorDto);
  }

  @Delete(':id')
  deleteColor(@Param('id') id: string) {
    return this.colorsService.deleteColor(id);
  }
}
