import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  createTransaction(createTransactionDto: CreateTransactionDto) {
    const transaction =
      this.transactionsRepository.create(createTransactionDto);

    return this.transactionsRepository.save(transaction);
  }

  getAllTransactions() {
    return this.transactionsRepository.find();
  }

  getTransaction(id: string) {
    return this.transactionsRepository.findOneBy({ id });
  }

  async deleteTransaction(id: string) {
    const transaction = await this.getTransaction(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.transactionsRepository.remove(transaction);
  }
}
