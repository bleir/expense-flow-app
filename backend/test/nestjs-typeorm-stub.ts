import { Inject } from '@nestjs/common';

export function getRepositoryToken(entity: { name?: string } | string) {
  const name = typeof entity === 'string' ? entity : (entity.name ?? 'Unknown');
  return `${name}Repository`;
}

export function InjectRepository(entity: { name?: string } | string) {
  return Inject(getRepositoryToken(entity));
}

export const TypeOrmModule = {
  forRoot: () => ({}),
  forRootAsync: () => ({}),
  forFeature: () => ({}),
};
