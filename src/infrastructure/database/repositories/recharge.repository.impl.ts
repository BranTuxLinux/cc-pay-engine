import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { RechargeRepository } from '../../../domain/repository/recharge.repository';
import { Recharge } from '../../../domain/entities/recharge.entity';

@Injectable()
export class RechargeRepositoryImpl implements RechargeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(recharge: Omit<Recharge, 'id' | 'createdAt'>): Promise<Recharge> {
    const created = await this.prisma.recharge.create({
      data: recharge,
    });
    
    return {
      ...created,
      fiatAmount: created.fiatAmount.toNumber(),
      cryptoAmount: created.cryptoAmount.toNumber(),
      transactionCost: created.transactionCost.toNumber(),
      exchangeRate: created.exchangeRate.toNumber(),
    };
  }

  async findAll(): Promise<Recharge[]> {
    const recharges = await this.prisma.recharge.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return recharges.map(r => ({
      ...r,
      fiatAmount: r.fiatAmount.toNumber(),
      cryptoAmount: r.cryptoAmount.toNumber(),
      transactionCost: r.transactionCost.toNumber(),
      exchangeRate: r.exchangeRate.toNumber(),
    }));
  }

  async findByUserId(userId: string): Promise<Recharge[]> {
    const recharges = await this.prisma.recharge.findMany({
      where: {
        wallet: {
          userId,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return recharges.map(r => ({
      ...r,
      fiatAmount: r.fiatAmount.toNumber(),
      cryptoAmount: r.cryptoAmount.toNumber(),
      transactionCost: r.transactionCost.toNumber(),
      exchangeRate: r.exchangeRate.toNumber(),
    }));
  }
}