import { WalletType } from "@prisma/client";

export class Wallet {
  id: string;
  userId: string;
  type: WalletType;
  createdAt: Date;
}

