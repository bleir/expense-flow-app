/// <reference types="jest" />
import { Test, TestingModule } from '@nestjs/testing';
import { ColorsController } from './colors.controller.js';
import { ColorsService } from './colors.service.js';

describe('ColorsController', () => {
  let controller: ColorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColorsController],
      providers: [{ provide: ColorsService, useValue: {} }],
    }).compile();

    controller = module.get<ColorsController>(ColorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
