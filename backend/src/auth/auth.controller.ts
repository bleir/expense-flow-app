import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signIn(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.signIn(CreateUserDto);
  }
}
