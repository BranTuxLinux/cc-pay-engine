import { Injectable, Inject } from '@nestjs/common';
import type { RechargeRepository } from '@/domain/repository/recharge.repository';
import { RECHARGE_REPOSITORY } from '../../infrastructure/database/database.module';

@Injectable()
export class ListRechargesUseCase {
  constructor(
    @Inject(RECHARGE_REPOSITORY) private readonly rechargeRepository: RechargeRepository
  ) {}

  async execute(userId?: string) {
    if (userId) {
      return this.rechargeRepository.findByUserId(userId);
    }
    return this.rechargeRepository.findAll();
  }
}