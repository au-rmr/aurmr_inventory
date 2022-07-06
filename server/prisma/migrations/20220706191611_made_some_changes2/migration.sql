/*
  Warnings:

  - You are about to drop the `AmazonProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AmazonProductToAttribute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AmazonProduct";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Attribute";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AmazonProductToAttribute";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "weight" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "attribute" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "amazonProduct_category" (
    "attribute_id" INTEGER NOT NULL,
    "amazon_product_id" INTEGER NOT NULL,

    PRIMARY KEY ("attribute_id", "amazon_product_id"),
    CONSTRAINT "amazonProduct_category_amazon_product_id_fkey" FOREIGN KEY ("amazon_product_id") REFERENCES "post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "amazonProduct_category_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attribute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "post_asin_key" ON "post"("asin");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_value_key" ON "attribute"("value");
