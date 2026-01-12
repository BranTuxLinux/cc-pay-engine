import { IsEnum, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FiatCurrency, TransactionType, WalletType } from '@prisma/client';

export class CreateRechargeDto {
  @ApiProperty({
    description: 'ID del usuario que realiza la recarga',
    example: '00000000-0000-0000-0000-000000000001',
    format: 'uuid',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Tipo de wallet destino',
    enum: WalletType,
    example: WalletType.USDC,
  })
  @IsEnum(WalletType)
  walletType: WalletType;

  @ApiProperty({
    description: 'Monto en moneda fiat',
    example: 100,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  fiatAmount: number;

  @ApiProperty({
    description: 'Moneda fiat utilizada',
    enum: FiatCurrency,
    example: FiatCurrency.USD,
  })
  @IsEnum(FiatCurrency)
  fiatCurrency: FiatCurrency;

  @ApiProperty({
    description: 'Tipo de transacción',
    enum: TransactionType,
    example: TransactionType.BANK_TRANSFER,
  })
  @IsEnum(TransactionType)
  transactionType: TransactionType;
}