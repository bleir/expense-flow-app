import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Color } from './color.entity.js';
import { Repository } from 'typeorm';
import { CreateColorDto } from './dto/create-color.dto.js';
import { UpdateColorDto } from './dto/update-color.dto.js';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color)
    private readonly colorsRepository: Repository<Color>,
  ) {}

  createColor(createColorDto: CreateColorDto) {
    const color = this.colorsRepository.create(createColorDto);

    return this.colorsRepository.save(color);
  }

  getColors() {
    return this.colorsRepository.find();
  }

  getColor(id: string) {
    return this.colorsRepository.findOneBy({ id });
  }

  async updateColor(id: string, updateColorDto: UpdateColorDto) {
    const color = await this.getColor(id);

    if (!color) {
      throw new NotFoundException('Color not found');
    }

    const updated = this.colorsRepository.merge(color, updateColorDto);

    return this.colorsRepository.save(updated);
  }

  async deleteColor(id: string) {
    const color = await this.getColor(id);

    if (!color) {
      throw new NotFoundException('Color not found.');
    }

    return this.colorsRepository.remove(color);
  }
}
