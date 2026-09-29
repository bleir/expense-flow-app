import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ColorsService } from './colors.service.js';
import { Color } from './color.entity.js';

describe('ColorsService', () => {
  let service: ColorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColorsService,
        { provide: getRepositoryToken(Color), useValue: {} },
      ],
    }).compile();

    service = module.get<ColorsService>(ColorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
