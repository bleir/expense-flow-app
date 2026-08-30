import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Color } from '../color.enum';

export class CreateCategoryDto {
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(Color)
  color: Color;
}
