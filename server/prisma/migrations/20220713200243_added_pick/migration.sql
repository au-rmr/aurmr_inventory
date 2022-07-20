/*
  Warnings:

  - You are about to drop the `Picks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Picks";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Pick" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "AmazonProductId" INTEGER NOT NULL,
    "Outcome" BOOLEAN NOT NULL,
    "TimeTakenSec" REAL NOT NULL,
    CONSTRAINT "Pick_AmazonProductId_fkey" FOREIGN KEY ("AmazonProductId") REFERENCES "AmazonProduct" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
