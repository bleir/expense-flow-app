import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { ColorsService } from './colors.service';
import { UpdateColorDto } from './dto/update-color.dto';

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
  async updateColor(@Param('id') id: string, updateColorDto: UpdateColorDto) {
    return this.colorsService.updateColor(id, updateColorDto);
  }

  @Delete(':id')
  deleteColor(@Param('id') id: string) {
    return this.colorsService.deleteColor(id);
  }
}
