import { Transaction } from 'src/transactions/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ default: '#6b7280' })
  color!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  monthlyBudget?: string | null;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions!: Transaction[];
}
