-- CreateTable
CREATE TABLE "Sublier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TIMESTAMP(3) NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sublier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sublier_name_key" ON "Sublier"("name");
