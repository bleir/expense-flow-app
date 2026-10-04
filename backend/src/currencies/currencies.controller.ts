import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrenciesService } from './currencies.service.js';
import { CreateCurrencyDto } from './dto/create-currency.dto.js';
import { UpdateCurrencyDto } from './dto/update-currency.dto.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { AuthenticatedUser } from '../auth/current-user.decorator.js';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  createCurrency(
    @Body() createCurrencyDto: CreateCurrencyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.currenciesService.createCurrency(createCurrencyDto, user.id);
  }

  @Get()
  getAllCurrencies(@CurrentUser() user: AuthenticatedUser) {
    return this.currenciesService.getAllCurrencies(user.id);
  }

  @Get(':id')
  getCurrency(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.currenciesService.getCurrency(id, user.id);
  }

  @Patch(':id')
  updateCurrency(
    @Param('id') id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.currenciesService.updateCurrency(
      id,
      updateCurrencyDto,
      user.id,
    );
  }

  @Delete(':id')
  deleteCurrency(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.currenciesService.deleteCurrency(id, user.id);
  }
}
