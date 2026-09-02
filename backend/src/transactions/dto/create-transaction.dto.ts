import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionType } from '../transaction.enum';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type!: TransactionType;

  @IsString()
  @IsNotEmpty()
  amount!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsOptional()
  notes?: string | null;
}
