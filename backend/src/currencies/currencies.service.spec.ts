import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CurrenciesService } from './currencies.service.js';
import { Currency } from './currency.entity.js';

describe('CurrenciesService', () => {
  let service: CurrenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrenciesService,
        { provide: getRepositoryToken(Currency), useValue: {} },
      ],
    }).compile();

    service = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
