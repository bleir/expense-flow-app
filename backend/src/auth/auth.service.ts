import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { ThemePreference } from './theme.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const existing = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existing) {
      throw new ConflictException('Email already in use.');
    }

    const password = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      email: createUserDto.email,
      password,
      theme: 'light',
    });
    const saved = await this.usersRepository.save(user);

    return this.issueSession(saved);
  }

  async signIn(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    const passwordMatches = user
      ? await bcrypt.compare(createUserDto.password, user.password)
      : false;

    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.issueSession(user);
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return { id: user.id, email: user.email, theme: user.theme };
  }

  async updateTheme(userId: string, theme: ThemePreference) {
    const profile = await this.getProfile(userId);
    await this.usersRepository.update({ id: userId }, { theme });

    return { ...profile, theme };
  }

  private async issueSession(user: User) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: { id: user.id, email: user.email },
    };
  }
}
