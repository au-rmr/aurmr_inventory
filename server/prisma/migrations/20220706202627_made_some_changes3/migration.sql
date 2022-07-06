/*
  Warnings:

  - You are about to drop the `amazonProduct_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "amazonProduct_category";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "attribute";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AmazonProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "weight" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AmazonProductAttribute" (
    "AttributeId" INTEGER NOT NULL,
    "AmazonProductId" INTEGER NOT NULL,

    PRIMARY KEY ("AttributeId", "AmazonProductId"),
    CONSTRAINT "AmazonProductAttribute_AmazonProductId_fkey" FOREIGN KEY ("AmazonProductId") REFERENCES "AmazonProduct" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AmazonProductAttribute_AttributeId_fkey" FOREIGN KEY ("AttributeId") REFERENCES "Attribute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AmazonProduct_asin_key" ON "AmazonProduct"("asin");

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_value_key" ON "Attribute"("value");
