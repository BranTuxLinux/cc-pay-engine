import { Wallet } from '@/domain/entities/wallet.entity';
import { WalletType } from '@prisma/client';

export interface WalletRepository {
  findById(id: string): Promise<Wallet | null>;
  findByUserIdAndType(userId: string, type: WalletType): Promise<Wallet | null>;
  create(wallet: Omit<Wallet, 'id' | 'createdAt'>): Promise<Wallet>;
}