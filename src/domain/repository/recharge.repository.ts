import { Recharge } from '@/domain/entities/recharge.entity';

export interface RechargeRepository {
  create(recharge: Omit<Recharge, 'id' | 'createdAt'>): Promise<Recharge>;
  findAll(): Promise<Recharge[]>;
  findByUserId(userId: string): Promise<Recharge[]>;
}