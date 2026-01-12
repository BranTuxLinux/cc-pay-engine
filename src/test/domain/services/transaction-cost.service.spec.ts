import { TransactionCostService } from '@/domain/services/transaction-cost.service';
import { TransactionType } from '@prisma/client';

describe('TransactionCostService', () => {
  let service: TransactionCostService;

  beforeEach(() => {
    service = new TransactionCostService();
  });

  describe('BANK_TRANSFER', () => {
    it('debería calcular 1% del monto sin costo fijo', () => {
      const result = service.calculateCost(
        TransactionType.BANK_TRANSFER,
        1000
      );

      expect(result).toBe(10);
    });

    it('debería calcular correctamente para montos pequeños', () => {
      const result = service.calculateCost(
        TransactionType.BANK_TRANSFER,
        100
      );

      expect(result).toBe(1);
    });

    it('debería calcular correctamente para montos grandes', () => {
      const result = service.calculateCost(
        TransactionType.BANK_TRANSFER,
        1000000
      );

      expect(result).toBe(10000);
    });
  });

  describe('NATIONAL_ATM', () => {
    it('debería cobrar $2.5 fijo sin importar el monto', () => {
      const result = service.calculateCost(
        TransactionType.NATIONAL_ATM,
        1000
      );

      expect(result).toBe(2.5);
    });

    it('debería cobrar $2.5 para montos pequeños', () => {
      const result = service.calculateCost(
        TransactionType.NATIONAL_ATM,
        10
      );

      expect(result).toBe(2.5);
    });

    it('debería cobrar $2.5 para montos grandes', () => {
      const result = service.calculateCost(
        TransactionType.NATIONAL_ATM,
        1000000
      );

      expect(result).toBe(2.5);
    });
  });

  describe('INTERNATIONAL_ATM', () => {
    it('debería cobrar $5 fijo + 2% del monto', () => {
      const result = service.calculateCost(
        TransactionType.INTERNATIONAL_ATM,
        1000
      );

      expect(result).toBe(25);
    });

    it('debería calcular correctamente para montos pequeños', () => {
      const result = service.calculateCost(
        TransactionType.INTERNATIONAL_ATM,
        100
      );

      expect(result).toBe(7);
    });

    it('debería calcular correctamente para montos grandes', () => {
      const result = service.calculateCost(
        TransactionType.INTERNATIONAL_ATM,
        1000000
      );

      expect(result).toBe(20005);
    });
  });

  describe('casos especiales', () => {
    it('debería manejar montos decimales', () => {
      const result = service.calculateCost(
        TransactionType.BANK_TRANSFER,
        250.50
      );

      expect(result).toBeCloseTo(2.505, 3);
    });

    it('debería calcular costo cero para transferencia bancaria sin monto', () => {
      const result = service.calculateCost(
        TransactionType.BANK_TRANSFER,
        0
      );

      expect(result).toBe(0);
    });

    it('debería cobrar solo el fijo para ATM nacional sin monto', () => {
      const result = service.calculateCost(
        TransactionType.NATIONAL_ATM,
        0
      );

      expect(result).toBe(2.5);
    });

    it('debería cobrar solo el fijo para ATM internacional sin monto', () => {
      const result = service.calculateCost(
        TransactionType.INTERNATIONAL_ATM,
        0
      );

      expect(result).toBe(5);
    });
  });
});

