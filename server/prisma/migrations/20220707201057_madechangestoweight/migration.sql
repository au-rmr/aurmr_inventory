/*
  Warnings:

  - You are about to alter the column `weight` on the `AmazonProduct` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - Added the required column `weight_units` to the `AmazonProduct` table without a default value. This is not possible if the table is not empty.

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
    "weight" REAL NOT NULL,
    "weight_units" TEXT NOT NULL
);
INSERT INTO "new_AmazonProduct" ("asin", "createdAt", "id", "name", "size_height", "size_length", "size_units", "size_width", "weight") SELECT "asin", "createdAt", "id", "name", "size_height", "size_length", "size_units", "size_width", "weight" FROM "AmazonProduct";
DROP TABLE "AmazonProduct";
ALTER TABLE "new_AmazonProduct" RENAME TO "AmazonProduct";
CREATE UNIQUE INDEX "AmazonProduct_asin_key" ON "AmazonProduct"("asin");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
