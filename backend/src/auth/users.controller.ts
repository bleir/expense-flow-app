import { Body, Controller, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import {
  CurrentUser,
  type AuthenticatedUser,
} from './current-user.decorator.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.id);
  }

  @Patch('me')
  updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.authService.updateTheme(user.id, updateUserDto.theme);
  }
}
