import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { RechargeModule } from './application/recharge.module';

@Module({
  imports: [
    DatabaseModule,
    RechargeModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
