-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AmazonProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asin" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size_length" REAL,
    "size_width" REAL,
    "size_height" REAL,
    "size_units" TEXT,
    "weight" REAL,
    "weight_units" TEXT
);
INSERT INTO "new_AmazonProduct" ("asin", "createdAt", "id", "name", "size_height", "size_length", "size_units", "size_width", "weight", "weight_units") SELECT "asin", "createdAt", "id", "name", "size_height", "size_length", "size_units", "size_width", "weight", "weight_units" FROM "AmazonProduct";
DROP TABLE "AmazonProduct";
ALTER TABLE "new_AmazonProduct" RENAME TO "AmazonProduct";
CREATE UNIQUE INDEX "AmazonProduct_asin_key" ON "AmazonProduct"("asin");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
