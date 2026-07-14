/*
  Warnings:

  - You are about to drop the column `totalPriceAfterDescount` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the column `priceAfterDiscount` on the `Product` table. All the data in the column will be lost.
  - Made the column `cartId` on table `CartItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_orderId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "totalPriceAfterDescount";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "orderId",
ALTER COLUMN "cartId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "priceAfterDiscount",
ADD COLUMN     "discound" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "orderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "ProductId" TEXT NOT NULL,
    "ProductName" TEXT NOT NULL,
    "productPrice" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orderItem" ADD CONSTRAINT "orderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
