-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_name_key" ON "Coupon"("name");
