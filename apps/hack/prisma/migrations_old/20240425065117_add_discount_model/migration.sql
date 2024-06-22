-- CreateTable
CREATE TABLE "discounts" (
    "id" SERIAL NOT NULL,
    "itemId" VARCHAR(20) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "discount" DECIMAL(65,30) NOT NULL,
    "discountPrice" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);
