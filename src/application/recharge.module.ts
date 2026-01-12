import { Module } from '@nestjs/common';
import { RechargeController } from '../infrastructure/api/controllers/recharge.controller';
import { CreateRechargeUseCase } from '../domain/use-case/create-recharge.use-case';
import { ListRechargesUseCase } from '../domain/use-case/list-recharges.use-case';
import { ExchangeRateService } from '../domain/services/exchange-rate.service';
import { TransactionCostService } from '../domain/services/transaction-cost.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';

@Module({
  controllers: [RechargeController],
  providers: [
    CreateRechargeUseCase,
    ListRechargesUseCase,
    ExchangeRateService,
    TransactionCostService,
    RolesGuard,
    Reflector,
  ],
})
export class RechargeModule {}

