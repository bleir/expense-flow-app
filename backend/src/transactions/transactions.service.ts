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
    const { categoryId, ...rest } = createTransactionDto;
    const transaction = this.transactionsRepository.create({
      ...rest,
      category: { id: categoryId },
    });

    return this.transactionsRepository.save(transaction);
  }

  getAllTransactions(limit?: number) {
    return this.transactionsRepository.find({
      relations: { category: true },
      order: { date: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }

  getTransaction(id: string) {
    return this.transactionsRepository.findOne({
      where: { id },
      relations: { category: true },
    });
  }

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const transaction = await this.getTransaction(id);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const { categoryId, ...rest } = updateTransactionDto;
    const updated = this.transactionsRepository.merge(transaction, rest);

    if (categoryId) {
      updated.category = { id: categoryId } as Transaction['category'];
    }

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
