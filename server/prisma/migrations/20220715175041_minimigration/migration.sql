/*
  Warnings:

  - The primary key for the `ProductBin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `binDefId` on the `ProductBin` table. All the data in the column will be lost.
  - Added the required column `binId` to the `ProductBin` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductBin" (
    "AmazonProductId" INTEGER NOT NULL,
    "binId" TEXT NOT NULL,
    "evalId" INTEGER NOT NULL,

    PRIMARY KEY ("AmazonProductId", "binId", "evalId"),
    CONSTRAINT "ProductBin_AmazonProductId_fkey" FOREIGN KEY ("AmazonProductId") REFERENCES "AmazonProduct" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductBin_binId_fkey" FOREIGN KEY ("binId") REFERENCES "Bin" ("BinId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductBin_evalId_fkey" FOREIGN KEY ("evalId") REFERENCES "Evaluation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductBin" ("AmazonProductId", "evalId") SELECT "AmazonProductId", "evalId" FROM "ProductBin";
DROP TABLE "ProductBin";
ALTER TABLE "new_ProductBin" RENAME TO "ProductBin";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
