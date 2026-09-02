import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  createCurrency(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.createCurrency(createCurrencyDto);
  }

  @Get()
  getAllCurrencies() {
    return this.currenciesService.getAllCurrencies();
  }

  @Get(':id')
  getCurrency(@Param('id') id: string) {
    return this.currenciesService.getCurrency(id);
  }

  @Patch(':id')
  updateCurrency(
    @Param('id') id: string,
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    return this.currenciesService.updateCurrency(id, updateCurrencyDto);
  }

  @Delete(':id')
  deleteCurrency(@Param('id') id: string) {
    return this.currenciesService.deleteCurrency(id);
  }
}
