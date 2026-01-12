import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepositoryImpl } from './repositories/user.repository.impl';
import { WalletRepositoryImpl } from './repositories/wallet.repository.impl';
import { RechargeRepositoryImpl } from './repositories/recharge.repository.impl';

export const USER_REPOSITORY = 'UserRepository';
export const WALLET_REPOSITORY = 'WalletRepository';
export const RECHARGE_REPOSITORY = 'RechargeRepository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepositoryImpl,
    },
    {
      provide: WALLET_REPOSITORY,
      useClass: WalletRepositoryImpl,
    },
    {
      provide: RECHARGE_REPOSITORY,
      useClass: RechargeRepositoryImpl,
    },
  ],
  exports: [
    PrismaService,
    USER_REPOSITORY,
    WALLET_REPOSITORY,
    RECHARGE_REPOSITORY,
  ],
})
export class DatabaseModule {}

