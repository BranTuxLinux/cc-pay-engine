import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { WalletRepository } from '../../../domain/repository/wallet.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';
import { WalletType } from '@prisma/client';

@Injectable()
export class WalletRepositoryImpl implements WalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Wallet | null> {
    return this.prisma.wallet.findUnique({
      where: { id },
    });
  }

  async findByUserIdAndType(userId: string, type: WalletType): Promise<Wallet | null> {
    return this.prisma.wallet.findUnique({
      where: {
        userId_type: {
          userId,
          type,
        },
      },
    });
  }

  async create(wallet: Omit<Wallet, 'id' | 'createdAt'>): Promise<Wallet> {
    return this.prisma.wallet.create({
      data: wallet,
    });
  }
}