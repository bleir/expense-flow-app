import { NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { User } from './user.entity.js';

describe('AuthService', () => {
  let service: AuthService;
  const usersRepository = {
    findOneBy: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    usersRepository.findOneBy.mockReset();
    usersRepository.update.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns the profile without the password', async () => {
    usersRepository.findOneBy.mockResolvedValue({
      id: 'user-1',
      email: 'ada@example.com',
      password: 'hashed',
      theme: 'dark',
    });

    await expect(service.getProfile('user-1')).resolves.toEqual({
      id: 'user-1',
      email: 'ada@example.com',
      theme: 'dark',
    });
  });

  it('rejects a missing profile', async () => {
    usersRepository.findOneBy.mockResolvedValue(null);

    await expect(service.getProfile('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('saves a theme change for the current user', async () => {
    usersRepository.findOneBy.mockResolvedValue({
      id: 'user-1',
      email: 'ada@example.com',
      password: 'hashed',
      theme: 'light',
    });
    usersRepository.update.mockResolvedValue({ affected: 1 });

    await expect(service.updateTheme('user-1', 'dark')).resolves.toEqual({
      id: 'user-1',
      email: 'ada@example.com',
      theme: 'dark',
    });
    expect(usersRepository.update).toHaveBeenCalledWith(
      { id: 'user-1' },
      { theme: 'dark' },
    );
  });
});
