import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service.js';
import { TransactionsController } from './transactions.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
