-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'READ_ONLY');

-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('USDC', 'COPW');

-- CreateEnum
CREATE TYPE "FiatCurrency" AS ENUM ('USD', 'CHF', 'COP');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BANK_TRANSFER', 'NATIONAL_ATM', 'INTERNATIONAL_ATM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'READ_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "WalletType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recharges" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "fiatAmount" DECIMAL(20,2) NOT NULL,
    "fiatCurrency" "FiatCurrency" NOT NULL,
    "cryptoAmount" DECIMAL(20,8) NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "transactionCost" DECIMAL(20,2) NOT NULL,
    "exchangeRate" DECIMAL(20,8) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recharges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_type_key" ON "wallets"("userId", "type");

-- CreateIndex
CREATE INDEX "recharges_walletId_idx" ON "recharges"("walletId");

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recharges" ADD CONSTRAINT "recharges_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
