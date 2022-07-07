/*
  Warnings:

  - You are about to drop the column `size` on the `AmazonProduct` table. All the data in the column will be lost.
  - Added the required column `size_height` to the `AmazonProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_length` to the `AmazonProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_units` to the `AmazonProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_width` to the `AmazonProduct` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AmazonProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size_length" REAL NOT NULL,
    "size_width" REAL NOT NULL,
    "size_height" REAL NOT NULL,
    "size_units" TEXT NOT NULL,
    "weight" TEXT NOT NULL
);
INSERT INTO "new_AmazonProduct" ("asin", "createdAt", "id", "name", "weight") SELECT "asin", "createdAt", "id", "name", "weight" FROM "AmazonProduct";
DROP TABLE "AmazonProduct";
ALTER TABLE "new_AmazonProduct" RENAME TO "AmazonProduct";
CREATE UNIQUE INDEX "AmazonProduct_asin_key" ON "AmazonProduct"("asin");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
