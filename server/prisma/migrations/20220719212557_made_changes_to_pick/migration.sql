/*
  Warnings:

  - Added the required column `binId` to the `Pick` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pick" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "AmazonProductId" INTEGER NOT NULL,
    "binId" TEXT NOT NULL,
    "evalId" INTEGER NOT NULL,
    "Outcome" BOOLEAN NOT NULL,
    "TimeTakenSec" REAL NOT NULL,
    CONSTRAINT "Pick_AmazonProductId_binId_evalId_fkey" FOREIGN KEY ("AmazonProductId", "binId", "evalId") REFERENCES "ProductBin" ("AmazonProductId", "binId", "evalId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pick_evalId_fkey" FOREIGN KEY ("evalId") REFERENCES "Evaluation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pick" ("AmazonProductId", "Outcome", "TimeTakenSec", "evalId", "id") SELECT "AmazonProductId", "Outcome", "TimeTakenSec", "evalId", "id" FROM "Pick";
DROP TABLE "Pick";
ALTER TABLE "new_Pick" RENAME TO "Pick";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
