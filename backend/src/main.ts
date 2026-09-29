import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Express } from 'express';
import { AppModule } from './app.module.js';

async function createServer(): Promise<Express> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();
  return app.getHttpAdapter().getInstance() as Express;
}

const serverPromise = createServer();

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const server = await serverPromise;
  server(req, res);
}

if (!process.env.VERCEL) {
  void serverPromise.then((server) => {
    server.listen(Number(process.env.PORT ?? 3001));
  });
}
