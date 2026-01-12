import { ExchangeRateService } from '@/domain/services/exchange-rate.service';
import { FiatCurrency, WalletType } from '@prisma/client';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;

  beforeEach(() => {
    service = new ExchangeRateService();
  });

  describe('conversiones a USDC', () => {
    it('debería convertir USD a USDC con tasa 1:1', () => {
      const amount = 100;
      const fromCurrency = FiatCurrency.USD;
      const walletType = WalletType.USDC;

      const result = service.convertToWalletCurrency(
        amount,
        fromCurrency,
        walletType
      );

      expect(result.cryptoAmount).toBe(100);
      expect(result.exchangeRate).toBe(1);
    });

    it('debería convertir CHF a USDC correctamente', () => {
      const result = service.convertToWalletCurrency(
        100,
        FiatCurrency.CHF,
        WalletType.USDC
      );

      expect(result.cryptoAmount).toBe(92);
      expect(result.exchangeRate).toBe(0.92);
    });

    it('debería convertir COP a USDC correctamente', () => {
      const result = service.convertToWalletCurrency(
        4000000,
        FiatCurrency.COP,
        WalletType.USDC
      );

      expect(result.cryptoAmount).toBe(1000);
      expect(result.exchangeRate).toBe(0.00025);
    });
  });

  describe('conversiones a COPW', () => {
    it('debería convertir COP a COPW con tasa 1:1', () => {
      const result = service.convertToWalletCurrency(
        1000000,
        FiatCurrency.COP,
        WalletType.COPW
      );

      expect(result.cryptoAmount).toBe(1000000);
      expect(result.exchangeRate).toBe(1);
    });

    it('debería convertir USD a COPW correctamente', () => {
      const result = service.convertToWalletCurrency(
        100,
        FiatCurrency.USD,
        WalletType.COPW
      );

      expect(result.cryptoAmount).toBe(400000);
      expect(result.exchangeRate).toBe(4000);
    });

    it('debería convertir CHF a COPW correctamente', () => {
      const result = service.convertToWalletCurrency(
        100,
        FiatCurrency.CHF,
        WalletType.COPW
      );

      expect(result.cryptoAmount).toBe(368000);
      expect(result.exchangeRate).toBe(3680);
    });
  });

  describe('casos especiales', () => {
    it('debería manejar montos decimales', () => {
      const result = service.convertToWalletCurrency(
        250.50,
        FiatCurrency.CHF,
        WalletType.USDC
      );

      expect(result.cryptoAmount).toBeCloseTo(230.46, 2);
      expect(result.exchangeRate).toBe(0.92);
    });

    it('debería manejar montos muy pequeños', () => {
      const result = service.convertToWalletCurrency(
        0.01,
        FiatCurrency.USD,
        WalletType.USDC
      );

      expect(result.cryptoAmount).toBe(0.01);
      expect(result.exchangeRate).toBe(1);
    });

    it('debería manejar montos muy grandes', () => {
      const result = service.convertToWalletCurrency(
        10000000,
        FiatCurrency.COP,
        WalletType.USDC
      );

      expect(result.cryptoAmount).toBe(2500);
      expect(result.exchangeRate).toBe(0.00025);
    });
  });

  describe('validaciones', () => {
    it('debería lanzar error para wallet type no soportado', () => {
      expect(() => {
        service.convertToWalletCurrency(
          100,
          FiatCurrency.USD,
          'BTC' as WalletType
        );
      }).toThrow('Wallet type BTC no soportado');
    });
  });
});

