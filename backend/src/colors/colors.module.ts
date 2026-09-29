import { Module } from '@nestjs/common';
import { ColorsController } from './colors.controller.js';
import { ColorsService } from './colors.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color } from './color.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Color])],
  controllers: [ColorsController],
  providers: [ColorsService],
})
export class ColorsModule {}
