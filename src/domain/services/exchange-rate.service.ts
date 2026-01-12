import { Injectable } from "@nestjs/common";
import { FiatCurrency, WalletType } from "@prisma/client";

@Injectable()
export class ExchangeRateService {
    private readonly rates={
        USD: 1.0,
        CHF: 0.92,
        COP: 0.00025,
    }
    private getWalletBaseCurrency(walletType: WalletType): FiatCurrency {
        switch (walletType) {
          case WalletType.USDC:
            return FiatCurrency.USD;
          case WalletType.COPW:
            return FiatCurrency.COP;
          default:
            throw new Error(`Wallet type ${walletType} no soportado`);
        }
      }
    
      convertToWalletCurrency(
        amount: number,
        fromCurrency: FiatCurrency,
        walletType: WalletType
      ): { cryptoAmount: number; exchangeRate: number } {
        const targetCurrency = this.getWalletBaseCurrency(walletType);
    
        const exchangeRate = this.rates[fromCurrency] / this.rates[targetCurrency];
        const cryptoAmount = amount * exchangeRate;
    
        return { cryptoAmount, exchangeRate };
      }
}