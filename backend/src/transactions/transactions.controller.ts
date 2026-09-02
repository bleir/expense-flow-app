import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @Get()
  getAllTransactions() {
    return this.transactionsService.getAllTransactions();
  }

  @Get(':id')
  getTransaction(@Param('id') id: string) {
    return this.transactionsService.getTransaction(id);
  }

  @Delete(':id')
  deleteTransaction(@Param('id') id: string) {
    return this.transactionsService.deleteTransaction(id);
  }
}
