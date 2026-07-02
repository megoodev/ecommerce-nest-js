/*
  Warnings:

  - Added the required column `updatedAt` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "subCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subCategory_name_key" ON "subCategory"("name");

-- AddForeignKey
ALTER TABLE "subCategory" ADD CONSTRAINT "subCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
