import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'color must be a hex color like #6b7280',
  })
  color!: string;

  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  @IsOptional()
  monthlyBudget?: string | null;
}
