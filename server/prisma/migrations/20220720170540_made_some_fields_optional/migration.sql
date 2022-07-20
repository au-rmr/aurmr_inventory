-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pick" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ProductBinId" INTEGER NOT NULL,
    "Outcome" BOOLEAN,
    "TimeTakenSec" REAL,
    CONSTRAINT "Pick_ProductBinId_fkey" FOREIGN KEY ("ProductBinId") REFERENCES "ProductBin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pick" ("Outcome", "ProductBinId", "TimeTakenSec", "id") SELECT "Outcome", "ProductBinId", "TimeTakenSec", "id" FROM "Pick";
DROP TABLE "Pick";
ALTER TABLE "new_Pick" RENAME TO "Pick";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
