import { ListRechargesUseCase } from '@/domain/use-case/list-recharges.use-case';
import type { RechargeRepository } from '@/domain/repository/recharge.repository';
import { FiatCurrency, TransactionType } from '@prisma/client';

describe('ListRechargesUseCase', () => {
  let useCase: ListRechargesUseCase;
  let rechargeRepository: jest.Mocked<RechargeRepository>;

  beforeEach(() => {
    rechargeRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
    };

    useCase = new ListRechargesUseCase(rechargeRepository);
  });

  describe('listar todas las recargas', () => {
    it('debería llamar a findAll cuando no se proporciona userId', async () => {
      const mockRecharges = [
        {
          id: 'recharge-1',
          walletId: 'wallet-1',
          fiatAmount: 100,
          fiatCurrency: FiatCurrency.USD,
          cryptoAmount: 100,
          transactionType: TransactionType.BANK_TRANSFER,
          transactionCost: 1,
          exchangeRate: 1,
          createdAt: new Date('2026-01-01'),
        },
        {
          id: 'recharge-2',
          walletId: 'wallet-2',
          fiatAmount: 200,
          fiatCurrency: FiatCurrency.CHF,
          cryptoAmount: 184,
          transactionType: TransactionType.NATIONAL_ATM,
          transactionCost: 2.5,
          exchangeRate: 0.92,
          createdAt: new Date('2026-01-02'),
        },
      ];

      rechargeRepository.findAll.mockResolvedValue(mockRecharges);

      const result = await useCase.execute();

      expect(result).toEqual(mockRecharges);
      expect(rechargeRepository.findAll).toHaveBeenCalledTimes(1);
      expect(rechargeRepository.findByUserId).not.toHaveBeenCalled();
    });

    it('debería devolver un array vacío si no hay recargas', async () => {
      rechargeRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(rechargeRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('listar recargas por usuario', () => {
    it('debería llamar a findByUserId cuando se proporciona userId', async () => {
      const userId = 'user-123';
      const mockRecharges = [
        {
          id: 'recharge-3',
          walletId: 'wallet-3',
          fiatAmount: 1000000,
          fiatCurrency: FiatCurrency.COP,
          cryptoAmount: 1000000,
          transactionType: TransactionType.INTERNATIONAL_ATM,
          transactionCost: 25000,
          exchangeRate: 1,
          createdAt: new Date('2026-01-03'),
        },
      ];

      rechargeRepository.findByUserId.mockResolvedValue(mockRecharges);

      const result = await useCase.execute(userId);

      expect(result).toEqual(mockRecharges);
      expect(rechargeRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(rechargeRepository.findByUserId).toHaveBeenCalledTimes(1);
      expect(rechargeRepository.findAll).not.toHaveBeenCalled();
    });

    it('debería devolver un array vacío si el usuario no tiene recargas', async () => {
      const userId = 'user-without-recharges';
      rechargeRepository.findByUserId.mockResolvedValue([]);

      const result = await useCase.execute(userId);

      expect(result).toEqual([]);
      expect(rechargeRepository.findByUserId).toHaveBeenCalledWith(userId);
    });
  });
});

