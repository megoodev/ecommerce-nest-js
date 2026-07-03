/*
  Warnings:

  - Added the required column `discount` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "discount" INTEGER NOT NULL;
