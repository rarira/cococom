-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;
