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

  async createColor(createColorDto: CreateColorDto, userId: string) {
    const color = this.colorsRepository.create({
      ...createColorDto,
      user: { id: userId },
    });
    const saved = await this.colorsRepository.save(color);
    const { user: _user, ...result } = saved;

    return result;
  }

  getColors(userId: string) {
    return this.colorsRepository.find({
      where: { user: { id: userId } },
    });
  }

  async getColor(id: string, userId: string) {
    const color = await this.colorsRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!color) {
      throw new NotFoundException('Color not found');
    }

    return color;
  }

  async updateColor(
    id: string,
    updateColorDto: UpdateColorDto,
    userId: string,
  ) {
    const color = await this.getColor(id, userId);
    const updated = this.colorsRepository.merge(color, updateColorDto);

    return this.colorsRepository.save(updated);
  }

  async deleteColor(id: string, userId: string) {
    const color = await this.getColor(id, userId);

    return this.colorsRepository.remove(color);
  }
}
