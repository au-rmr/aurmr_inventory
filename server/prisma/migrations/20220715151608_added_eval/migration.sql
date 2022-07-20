/*
  Warnings:

  - Added the required column `evalId` to the `Pick` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Bin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "BinId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ProductBin" (
    "AmazonProductId" INTEGER NOT NULL,
    "binDefId" INTEGER NOT NULL,
    "evalId" INTEGER NOT NULL,

    PRIMARY KEY ("AmazonProductId", "binDefId", "evalId"),
    CONSTRAINT "ProductBin_AmazonProductId_fkey" FOREIGN KEY ("AmazonProductId") REFERENCES "AmazonProduct" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductBin_binDefId_fkey" FOREIGN KEY ("binDefId") REFERENCES "Bin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductBin_evalId_fkey" FOREIGN KEY ("evalId") REFERENCES "Evaluation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pick" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "AmazonProductId" INTEGER NOT NULL,
    "Outcome" BOOLEAN NOT NULL,
    "TimeTakenSec" REAL NOT NULL,
    "evalId" INTEGER NOT NULL,
    CONSTRAINT "Pick_AmazonProductId_fkey" FOREIGN KEY ("AmazonProductId") REFERENCES "AmazonProduct" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pick_evalId_fkey" FOREIGN KEY ("evalId") REFERENCES "Evaluation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pick" ("AmazonProductId", "Outcome", "TimeTakenSec", "id") SELECT "AmazonProductId", "Outcome", "TimeTakenSec", "id" FROM "Pick";
DROP TABLE "Pick";
ALTER TABLE "new_Pick" RENAME TO "Pick";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Bin_BinId_key" ON "Bin"("BinId");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_name_key" ON "Evaluation"("name");
