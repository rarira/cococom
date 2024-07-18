-- Step 1: Find the lowest discountPrice and highest discountRate for each itemId
WITH discount_stats AS (
    SELECT
        "itemId",
        MIN("discountPrice") AS lowestPrice,
        MAX("discountRate") AS bestDiscountRate
    FROM
        public.discounts
    GROUP BY
        "itemId"
)
-- Step 2: Update the items table with these values for rows where lowestPrice or bestDiscountRate is NULL
UPDATE
    public.items i
SET
    "lowestPrice" = ds.lowestPrice,
    "bestDiscountRate" = ds.bestDiscountRate
FROM
    discount_stats ds
WHERE
    i."itemId" = ds."itemId"
    AND (i."lowestPrice" IS NULL OR i."bestDiscountRate" IS NULL);