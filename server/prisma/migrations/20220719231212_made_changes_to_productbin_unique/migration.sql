/*
  Warnings:

  - The primary key for the `ProductBin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AmazonProductId` on the `Pick` table. All the data in the column will be lost.
  - You are about to drop the column `binId` on the `Pick` table. All the data in the column will be lost.
  - You are about to drop the column `evalId` on the `Pick` table. All the data in the column will be lost.
  - Added the required column `ProductBinId` to the `Pick` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductBin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "AmazonProductId" INTEGER NOT NULL,
    "binId" TEXT NOT NULL,
    "evalId" INTEGER NOT NULL,
    CONSTRAINT "ProductBin_AmazonProductId_fkey" FOREIGN KEY ("AmazonProductId") REFERENCES "AmazonProduct" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductBin_binId_fkey" FOREIGN KEY ("binId") REFERENCES "Bin" ("BinId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductBin_evalId_fkey" FOREIGN KEY ("evalId") REFERENCES "Evaluation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductBin" ("AmazonProductId", "binId", "evalId") SELECT "AmazonProductId", "binId", "evalId" FROM "ProductBin";
DROP TABLE "ProductBin";
ALTER TABLE "new_ProductBin" RENAME TO "ProductBin";
CREATE TABLE "new_Pick" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ProductBinId" INTEGER NOT NULL,
    "Outcome" BOOLEAN NOT NULL,
    "TimeTakenSec" REAL NOT NULL,
    CONSTRAINT "Pick_ProductBinId_fkey" FOREIGN KEY ("ProductBinId") REFERENCES "ProductBin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pick" ("Outcome", "TimeTakenSec", "id") SELECT "Outcome", "TimeTakenSec", "id" FROM "Pick";
DROP TABLE "Pick";
ALTER TABLE "new_Pick" RENAME TO "Pick";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
