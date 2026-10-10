import { IsIn } from 'class-validator';
import { THEME_PREFERENCES, type ThemePreference } from '../theme.js';

export class UpdateUserDto {
  @IsIn(THEME_PREFERENCES)
  theme!: ThemePreference;
}
