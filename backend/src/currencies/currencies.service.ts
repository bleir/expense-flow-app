import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Currency } from './currency.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCurrencyDto } from './dto/create-currency.dto.js';
import { UpdateCurrencyDto } from './dto/update-currency.dto.js';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currenciesRepository: Repository<Currency>,
  ) {}

  async createCurrency(createCurrencyDto: CreateCurrencyDto, userId: string) {
    const currency = this.currenciesRepository.create({
      ...createCurrencyDto,
      user: { id: userId },
    });
    const saved = await this.currenciesRepository.save(currency);
    const { user: _user, ...result } = saved;

    return result;
  }

  getAllCurrencies(userId: string) {
    return this.currenciesRepository.find({
      where: { user: { id: userId } },
    });
  }

  async getCurrency(id: string, userId: string) {
    const currency = await this.currenciesRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    return currency;
  }

  async updateCurrency(
    id: string,
    updateCurrencyDto: UpdateCurrencyDto,
    userId: string,
  ) {
    const currency = await this.getCurrency(id, userId);
    const updated = this.currenciesRepository.merge(
      currency,
      updateCurrencyDto,
    );

    return this.currenciesRepository.save(updated);
  }

  async deleteCurrency(id: string, userId: string) {
    const currency = await this.getCurrency(id, userId);

    return this.currenciesRepository.remove(currency);
  }
}
