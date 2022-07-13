-- CreateTable
CREATE TABLE "Picks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "AmazonProductId" INTEGER NOT NULL,
    "Outcome" BOOLEAN NOT NULL,
    "TimeTakenSec" REAL NOT NULL,
    CONSTRAINT "Picks_AmazonProductId_fkey" FOREIGN KEY ("AmazonProductId") REFERENCES "AmazonProduct" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
