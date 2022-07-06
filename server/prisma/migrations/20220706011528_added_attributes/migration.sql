/*
  Warnings:

  - You are about to drop the column `attributes` on the `AmazonProduct` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Attribute" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AmazonProductToAttribute" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AmazonProductToAttribute_A_fkey" FOREIGN KEY ("A") REFERENCES "AmazonProduct" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AmazonProductToAttribute_B_fkey" FOREIGN KEY ("B") REFERENCES "Attribute" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AmazonProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "weight" TEXT NOT NULL
);
INSERT INTO "new_AmazonProduct" ("asin", "createdAt", "id", "name", "size", "weight") SELECT "asin", "createdAt", "id", "name", "size", "weight" FROM "AmazonProduct";
DROP TABLE "AmazonProduct";
ALTER TABLE "new_AmazonProduct" RENAME TO "AmazonProduct";
CREATE UNIQUE INDEX "AmazonProduct_asin_key" ON "AmazonProduct"("asin");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_value_key" ON "Attribute"("value");

-- CreateIndex
CREATE UNIQUE INDEX "_AmazonProductToAttribute_AB_unique" ON "_AmazonProductToAttribute"("A", "B");

-- CreateIndex
CREATE INDEX "_AmazonProductToAttribute_B_index" ON "_AmazonProductToAttribute"("B");
