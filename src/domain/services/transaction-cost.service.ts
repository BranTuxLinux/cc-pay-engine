import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionCostService {
  private readonly costs = {
    BANK_TRANSFER: { fixed: 0, percentage: 0.01 },
    NATIONAL_ATM: { fixed: 2.5, percentage: 0 },
    INTERNATIONAL_ATM: { fixed: 5.0, percentage: 0.02 },
  };

  calculateCost(transactionType: TransactionType, amount: number): number {
    const cost = this.costs[transactionType];
    return cost.fixed + (amount * cost.percentage);
  }
}