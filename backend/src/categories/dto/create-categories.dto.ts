import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  color!: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  @IsOptional()
  monthlyBudget?: string | null;
}
