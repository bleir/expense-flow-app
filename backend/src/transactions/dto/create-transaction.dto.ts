import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../transaction.enum';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;

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
