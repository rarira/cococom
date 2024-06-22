/*
  Warnings:

  - The `categoryId` column on the `items` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "items" DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER;
