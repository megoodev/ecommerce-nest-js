-- CreateTable
CREATE TABLE "Tax" (
    "id" TEXT NOT NULL,
    "taxPrice" INTEGER NOT NULL,
    "shipingTax" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);
