import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { ColorsModule } from './colors/colors.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        const host = config.get<string>('DATABASE_HOST') ?? 'localhost';
        const isLocal =
          host === 'localhost' ||
          host === '127.0.0.1' ||
          Boolean(url?.includes('localhost') || url?.includes('127.0.0.1'));
        const ssl = isLocal ? false : { rejectUnauthorized: false };

        if (url) {
          return {
            type: 'postgres' as const,
            url,
            autoLoadEntities: true,
            synchronize: true,
            ssl,
          };
        }

        return {
          type: 'postgres' as const,
          host,
          port: Number(config.get('DATABASE_PORT') ?? 5432),
          username: config.get<string>('DATABASE_USER'),
          password: config.get<string>('DATABASE_PASSWORD'),
          database: config.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: true,
          ssl,
        };
      },
    }),
    CategoriesModule,
    TransactionsModule,
    CurrenciesModule,
    ColorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
