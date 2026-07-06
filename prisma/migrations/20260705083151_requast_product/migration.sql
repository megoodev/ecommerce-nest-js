-- CreateTable
CREATE TABLE "RequestProduct" (
    "id" TEXT NOT NULL,
    "titleNeed" TEXT NOT NULL,
    "detailes" TEXT NOT NULL,
    "qauntity" INTEGER,
    "category" TEXT,
    "userId" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RequestProduct" ADD CONSTRAINT "RequestProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
