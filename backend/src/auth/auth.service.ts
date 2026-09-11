import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
    });
    const saved = await this.usersRepository.save(user);

    const { password: _, ...result } = saved;

    return result;
  }

  signIn() {}
}
