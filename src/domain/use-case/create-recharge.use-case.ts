import { Injectable, Inject } from '@nestjs/common';
import type { WalletRepository } from '@/domain/repository/wallet.repository';
import type { RechargeRepository } from '@/domain/repository/recharge.repository';
import { ExchangeRateService } from '@/domain/services/exchange-rate.service';
import { TransactionCostService } from '@/domain/services/transaction-cost.service';
import { FiatCurrency, TransactionType, WalletType } from '@prisma/client';
import { WALLET_REPOSITORY, RECHARGE_REPOSITORY } from '../../infrastructure/database/database.module';

export interface CreateRechargeInput {
  userId: string;
  walletType: WalletType;
  fiatAmount: number;
  fiatCurrency: FiatCurrency;
  transactionType: TransactionType;
}

@Injectable()
export class CreateRechargeUseCase {
  constructor(
    @Inject(WALLET_REPOSITORY) private readonly walletRepository: WalletRepository,
    @Inject(RECHARGE_REPOSITORY) private readonly rechargeRepository: RechargeRepository,
    private readonly exchangeRateService: ExchangeRateService,
    private readonly transactionCostService: TransactionCostService,
  ) {}

  async execute(input: CreateRechargeInput) {
    let wallet = await this.walletRepository.findByUserIdAndType(
      input.userId,
      input.walletType,
    );

    if (!wallet) {
      wallet = await this.walletRepository.create({
        userId: input.userId,
        type: input.walletType,
      });
    }

    const { cryptoAmount, exchangeRate } =
      this.exchangeRateService.convertToWalletCurrency(
        input.fiatAmount,
        input.fiatCurrency,
        input.walletType,
      );

    const transactionCost = this.transactionCostService.calculateCost(
      input.transactionType,
      input.fiatAmount,
    );

    const recharge = await this.rechargeRepository.create({
      walletId: wallet.id,
      fiatAmount: input.fiatAmount,
      fiatCurrency: input.fiatCurrency,
      cryptoAmount,
      transactionType: input.transactionType,
      transactionCost,
      exchangeRate,
    });

    return recharge;
  }
}