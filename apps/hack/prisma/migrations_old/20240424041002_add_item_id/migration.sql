/*
  Warnings:

  - You are about to drop the column `name` on the `item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[itemId]` on the table `item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE item_id_seq;


ALTER TABLE "item" DROP COLUMN "name",
ADD COLUMN     "itemId" VARCHAR(20) NOT NULL,
ADD COLUMN     "itemName" VARCHAR(20);


ALTER SEQUENCE item_id_seq OWNED BY item.id;


ALTER TABLE "item" ALTER COLUMN "id" SET DEFAULT nextval('item_id_seq');

-- CreateIndex
CREATE UNIQUE INDEX "item_itemId_key" ON "item"("itemId");
