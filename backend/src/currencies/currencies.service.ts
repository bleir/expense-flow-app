import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Currency } from './currency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currenciesRepository: Repository<Currency>,
  ) {}

  createCurrency(createCurrencyDto: CreateCurrencyDto) {
    const currency = this.currenciesRepository.create(createCurrencyDto);

    return this.currenciesRepository.save(currency);
  }

  getAllCurrencies() {
    return this.currenciesRepository.find();
  }

  getCurrency(id: string) {
    return this.currenciesRepository.findOneBy({ id });
  }

  async updateCurrency(id: string, updateCurrencyDto: UpdateCurrencyDto) {
    const currency = await this.getCurrency(id);

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    const updated = this.currenciesRepository.merge(
      currency,
      updateCurrencyDto,
    );

    return this.currenciesRepository.save(updated);
  }

  async deleteCurrency(id: string) {
    const currency = await this.getCurrency(id);

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    return this.currenciesRepository.remove(currency);
  }
}
