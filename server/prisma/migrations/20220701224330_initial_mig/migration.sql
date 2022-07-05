-- CreateTable
CREATE TABLE "AmazonProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "attributes" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AmazonProduct_asin_key" ON "AmazonProduct"("asin");
