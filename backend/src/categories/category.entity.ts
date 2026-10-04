import type { Transaction } from '../transactions/transaction.entity.js';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity.js';

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

  @OneToMany('Transaction', 'category')
  transactions!: Transaction[];

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
