import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCurrencyDto {
  @IsNotEmpty()
  @IsString()
  code!: string;

  @IsNotEmpty()
  @IsString()
  currency!: string;

  @IsNotEmpty()
  @IsString()
  symbol!: string;

  @IsBoolean()
  isActive!: boolean;
}
