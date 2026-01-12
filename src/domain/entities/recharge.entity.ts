import { FiatCurrency, TransactionType } from "@prisma/client";

export class Recharge {
    id: string;
    walletId: string;
    fiatAmount: number;
    fiatCurrency: FiatCurrency;
    cryptoAmount: number;
    transactionType: TransactionType;
    transactionCost: number;
    exchangeRate: number;
    createdAt: Date;
  }