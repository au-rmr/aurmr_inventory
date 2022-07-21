/*
  Warnings:

  - Added the required column `BinName` to the `Bin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TableId` to the `Bin` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "BinId" TEXT NOT NULL,
    "BinName" TEXT NOT NULL,
    "TableId" TEXT NOT NULL,
    "TableName" TEXT
);
INSERT INTO "new_Bin" ("BinId", "id") SELECT "BinId", "id" FROM "Bin";
DROP TABLE "Bin";
ALTER TABLE "new_Bin" RENAME TO "Bin";
CREATE UNIQUE INDEX "Bin_BinId_key" ON "Bin"("BinId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
