import { CreateRechargeUseCase } from '@/domain/use-case/create-recharge.use-case';
import { ExchangeRateService } from '@/domain/services/exchange-rate.service';
import { TransactionCostService } from '@/domain/services/transaction-cost.service';
import type { WalletRepository } from '@/domain/repository/wallet.repository';
import type { RechargeRepository } from '@/domain/repository/recharge.repository';
import { FiatCurrency, TransactionType, WalletType } from '@prisma/client';

describe('CreateRechargeUseCase', () => {
  let useCase: CreateRechargeUseCase;
  let walletRepository: jest.Mocked<WalletRepository>;
  let rechargeRepository: jest.Mocked<RechargeRepository>;
  let exchangeRateService: ExchangeRateService;
  let transactionCostService: TransactionCostService;

  beforeEach(() => {
    walletRepository = {
      findById: jest.fn(),
      findByUserIdAndType: jest.fn(),
      create: jest.fn(),
    };

    rechargeRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
    };

    exchangeRateService = new ExchangeRateService();
    transactionCostService = new TransactionCostService();

    useCase = new CreateRechargeUseCase(
      walletRepository,
      rechargeRepository,
      exchangeRateService,
      transactionCostService
    );
  });

  describe('cuando la wallet ya existe', () => {
    it('debería crear una recarga sin crear una nueva wallet', async () => {
      const mockWallet = {
        id: 'wallet-123',
        userId: 'user-123',
        type: WalletType.USDC,
        createdAt: new Date(),
      };

      const mockRecharge = {
        id: 'recharge-123',
        walletId: 'wallet-123',
        fiatAmount: 100,
        fiatCurrency: FiatCurrency.USD,
        cryptoAmount: 100,
        transactionType: TransactionType.BANK_TRANSFER,
        transactionCost: 1,
        exchangeRate: 1,
        createdAt: new Date(),
      };

      walletRepository.findByUserIdAndType.mockResolvedValue(mockWallet);
      rechargeRepository.create.mockResolvedValue(mockRecharge);

      const input = {
        userId: 'user-123',
        walletType: WalletType.USDC,
        fiatAmount: 100,
        fiatCurrency: FiatCurrency.USD,
        transactionType: TransactionType.BANK_TRANSFER,
      };

      const result = await useCase.execute(input);

      expect(result).toEqual(mockRecharge);
      expect(walletRepository.findByUserIdAndType).toHaveBeenCalledWith(
        'user-123',
        WalletType.USDC
      );
      expect(walletRepository.create).not.toHaveBeenCalled();
      expect(rechargeRepository.create).toHaveBeenCalledWith({
        walletId: 'wallet-123',
        fiatAmount: 100,
        fiatCurrency: FiatCurrency.USD,
        cryptoAmount: 100,
        transactionType: TransactionType.BANK_TRANSFER,
        transactionCost: 1,
        exchangeRate: 1,
      });
    });
  });

  describe('cuando la wallet NO existe', () => {
    it('debería crear la wallet y luego la recarga', async () => {
      const mockWallet = {
        id: 'new-wallet-123',
        userId: 'user-456',
        type: WalletType.COPW,
        createdAt: new Date(),
      };

      const mockRecharge = {
        id: 'recharge-456',
        walletId: 'new-wallet-123',
        fiatAmount: 1000000,
        fiatCurrency: FiatCurrency.COP,
        cryptoAmount: 1000000,
        transactionType: TransactionType.NATIONAL_ATM,
        transactionCost: 2.5,
        exchangeRate: 1,
        createdAt: new Date(),
      };

      walletRepository.findByUserIdAndType.mockResolvedValue(null);
      walletRepository.create.mockResolvedValue(mockWallet);
      rechargeRepository.create.mockResolvedValue(mockRecharge);

      const input = {
        userId: 'user-456',
        walletType: WalletType.COPW,
        fiatAmount: 1000000,
        fiatCurrency: FiatCurrency.COP,
        transactionType: TransactionType.NATIONAL_ATM,
      };

      const result = await useCase.execute(input);

      expect(result).toEqual(mockRecharge);
      expect(walletRepository.findByUserIdAndType).toHaveBeenCalledWith(
        'user-456',
        WalletType.COPW
      );
      expect(walletRepository.create).toHaveBeenCalledWith({
        userId: 'user-456',
        type: WalletType.COPW,
      });
      expect(rechargeRepository.create).toHaveBeenCalledWith({
        walletId: 'new-wallet-123',
        fiatAmount: 1000000,
        fiatCurrency: FiatCurrency.COP,
        cryptoAmount: 1000000,
        transactionType: TransactionType.NATIONAL_ATM,
        transactionCost: 2.5,
        exchangeRate: 1,
      });
    });
  });

  describe('cálculos de conversión y costos', () => {
    it('debería calcular correctamente CHF a USDC con ATM internacional', async () => {
      const mockWallet = {
        id: 'wallet-789',
        userId: 'user-789',
        type: WalletType.USDC,
        createdAt: new Date(),
      };

      walletRepository.findByUserIdAndType.mockResolvedValue(mockWallet);
      rechargeRepository.create.mockResolvedValue({
        id: 'recharge-789',
        walletId: 'wallet-789',
        fiatAmount: 100,
        fiatCurrency: FiatCurrency.CHF,
        cryptoAmount: 92,
        transactionType: TransactionType.INTERNATIONAL_ATM,
        transactionCost: 7,
        exchangeRate: 0.92,
        createdAt: new Date(),
      });

      const input = {
        userId: 'user-789',
        walletType: WalletType.USDC,
        fiatAmount: 100,
        fiatCurrency: FiatCurrency.CHF,
        transactionType: TransactionType.INTERNATIONAL_ATM,
      };

      await useCase.execute(input);

      expect(rechargeRepository.create).toHaveBeenCalledWith({
        walletId: 'wallet-789',
        fiatAmount: 100,
        fiatCurrency: FiatCurrency.CHF,
        cryptoAmount: 92, // 100 CHF * 0.92
        transactionType: TransactionType.INTERNATIONAL_ATM,
        transactionCost: 7, // $5 + (100 * 0.02)
        exchangeRate: 0.92,
      });
    });

    it('debería calcular correctamente USD a COPW con transferencia bancaria', async () => {
      const mockWallet = {
        id: 'wallet-999',
        userId: 'user-999',
        type: WalletType.COPW,
        createdAt: new Date(),
      };

      walletRepository.findByUserIdAndType.mockResolvedValue(mockWallet);
      rechargeRepository.create.mockResolvedValue({
        id: 'recharge-999',
        walletId: 'wallet-999',
        fiatAmount: 200,
        fiatCurrency: FiatCurrency.USD,
        cryptoAmount: 800000,
        transactionType: TransactionType.BANK_TRANSFER,
        transactionCost: 2,
        exchangeRate: 4000,
        createdAt: new Date(),
      });

      const input = {
        userId: 'user-999',
        walletType: WalletType.COPW,
        fiatAmount: 200,
        fiatCurrency: FiatCurrency.USD,
        transactionType: TransactionType.BANK_TRANSFER,
      };

      await useCase.execute(input);

      expect(rechargeRepository.create).toHaveBeenCalledWith({
        walletId: 'wallet-999',
        fiatAmount: 200,
        fiatCurrency: FiatCurrency.USD,
        cryptoAmount: 800000, // 200 USD * 4000
        transactionType: TransactionType.BANK_TRANSFER,
        transactionCost: 2, // 200 * 0.01
        exchangeRate: 4000,
      });
    });
  });
});

