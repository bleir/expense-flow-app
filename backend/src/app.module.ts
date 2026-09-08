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
        const ssl = { rejectUnauthorized: false };
        const url = config.get<string>('DATABASE_URL');

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
          host: config.get<string>('DATABASE_HOST'),
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
