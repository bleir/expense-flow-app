import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { Category } from '../categories/category.entity.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ) {
    const { categoryId, ...rest } = createTransactionDto;
    await this.ownedCategory(categoryId, userId);
    const transaction = this.transactionsRepository.create({
      ...rest,
      category: { id: categoryId },
      user: { id: userId },
    });
    const saved = await this.transactionsRepository.save(transaction);
    const { user: _user, ...result } = saved;

    return result;
  }

  getAllTransactions(userId: string, limit?: number) {
    return this.transactionsRepository.find({
      where: { user: { id: userId } },
      relations: { category: true },
      order: { date: 'DESC', createdAt: 'DESC' },
      take: limit,
    });
  }

  async getTransaction(id: string, userId: string) {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { category: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ) {
    const transaction = await this.getTransaction(id, userId);
    const { categoryId, ...rest } = updateTransactionDto;
    const updated = this.transactionsRepository.merge(transaction, rest);

    if (categoryId) {
      await this.ownedCategory(categoryId, userId);
      updated.category = { id: categoryId } as Transaction['category'];
    }

    return this.transactionsRepository.save(updated);
  }

  async deleteTransaction(id: string, userId: string) {
    const transaction = await this.getTransaction(id, userId);

    return this.transactionsRepository.remove(transaction);
  }

  private async ownedCategory(categoryId: string, userId: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId, user: { id: userId } },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
