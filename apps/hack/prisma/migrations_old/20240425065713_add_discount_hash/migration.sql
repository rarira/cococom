/*
  Warnings:

  - A unique constraint covering the columns `[discountHash]` on the table `discounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discountHash` to the `discounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "discounts" ADD COLUMN     "discountHash" VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "discounts_discountHash_key" ON "discounts"("discountHash");
