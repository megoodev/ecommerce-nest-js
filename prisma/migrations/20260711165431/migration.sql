/*
  Warnings:

  - You are about to alter the column `totlaPrice` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `totalPriceAfterDescount` on the `Cart` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "totlaPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalPriceAfterDescount" SET DATA TYPE DOUBLE PRECISION;
