/*
  Warnings:

  - A unique constraint covering the columns `[cartId,productId]` on the table `cartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cart" ALTER COLUMN "TotlaPrice" DROP NOT NULL,
ALTER COLUMN "TotalPriceAfterDescount" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cartItem_cartId_productId_key" ON "cartItem"("cartId", "productId");
