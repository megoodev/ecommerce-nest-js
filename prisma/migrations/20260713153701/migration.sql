/*
  Warnings:

  - You are about to drop the column `ProductId` on the `orderItem` table. All the data in the column will be lost.
  - You are about to drop the column `ProductName` on the `orderItem` table. All the data in the column will be lost.
  - Added the required column `productId` to the `orderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `orderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orderItem" DROP COLUMN "ProductId",
DROP COLUMN "ProductName",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL;
