-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('cash', 'card');

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "orderId" TEXT;

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taxPrice" INTEGER NOT NULL DEFAULT 0,
    "shippingPrice" INTEGER NOT NULL DEFAULT 0,
    "totalOrderPrice" INTEGER NOT NULL,
    "paymentMethod" "PaymentMethodType" NOT NULL DEFAULT 'card',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "isDeliverd" BOOLEAN NOT NULL DEFAULT false,
    "deliverAt" TIMESTAMP(3),
    "shippingAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
