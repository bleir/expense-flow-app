import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

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

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = await this.getTransaction(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const updated = this.transactionsRepository.merge(
      transaction,
      updateTransactionDto,
    );
    return this.transactionsRepository.save(updated);
  }

  async deleteTransaction(id: string) {
    const transaction = await this.getTransaction(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return this.transactionsRepository.remove(transaction);
  }
}
