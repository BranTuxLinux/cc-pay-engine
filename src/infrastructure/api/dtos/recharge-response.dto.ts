import { ApiProperty } from '@nestjs/swagger';
import { FiatCurrency, TransactionType } from '@prisma/client';

export class RechargeResponseDto {
  @ApiProperty({
    description: 'ID único de la recarga',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'ID de la wallet donde se realizó la recarga',
    example: 'wallet-123',
  })
  walletId: string;

  @ApiProperty({
    description: 'Monto en moneda fiat',
    example: 100,
  })
  fiatAmount: number;

  @ApiProperty({
    description: 'Moneda fiat utilizada',
    enum: FiatCurrency,
    example: FiatCurrency.USD,
  })
  fiatCurrency: FiatCurrency;

  @ApiProperty({
    description: 'Cantidad de criptomoneda calculada después de la conversión',
    example: 100,
  })
  cryptoAmount: number;

  @ApiProperty({
    description: 'Tipo de transacción utilizada',
    enum: TransactionType,
    example: TransactionType.BANK_TRANSFER,
  })
  transactionType: TransactionType;

  @ApiProperty({
    description: 'Costo de la transacción aplicado',
    example: 1,
  })
  transactionCost: number;

  @ApiProperty({
    description: 'Tasa de cambio aplicada en la conversión',
    example: 1,
  })
  exchangeRate: number;

  @ApiProperty({
    description: 'Fecha de creación de la recarga',
    example: '2026-01-12T08:00:00.000Z',
  })
  createdAt: Date;
}