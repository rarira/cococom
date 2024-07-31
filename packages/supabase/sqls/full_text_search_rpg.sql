CREATE OR REPLACE FUNCTION search_items_by_keyword(keyword text, is_on_sale boolean)
RETURNS TABLE(
    id INT,
    "itemId" TEXT,
    "itemName" TEXT,
    "bestDiscountRate" NUMERIC,
    "bestDiscount" NUMERIC,
    "lowestPrice" NUMERIC,
    "isOnSaleNow" BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT i.id,
        i."itemId",
        i."itemName",
        i."bestDiscountRate",
        i."bestDiscount",
        i."lowestPrice",
    EXISTS (
        SELECT 1
        FROM discounts d
        WHERE d."itemId" = i."itemId"
        AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
    ) as "isOnSaleNow"
    FROM items i
    WHERE i."itemName" &@~ keyword
    AND (
        NOT is_on_sale OR EXISTS (
            SELECT 1
            FROM discounts
            WHERE discounts."itemId" = i."itemId"
            AND CURRENT_TIMESTAMP BETWEEN discounts."startDate" AND discounts."endDate"
        )
    );
END;
$$;

CREATE OR REPLACE FUNCTION search_items_by_itemId(item_id text, is_on_sale boolean)
RETURNS TABLE(
    id INT,
    "itemId" TEXT,
    "itemName" TEXT,
    "bestDiscountRate" NUMERIC,
    "bestDiscount" NUMERIC,
    "lowestPrice" NUMERIC,
    "isOnSaleNow" BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT i.id,
        i."itemId",
        i."itemName",
        i."bestDiscountRate",
        i."bestDiscount",
        i."lowestPrice",
    EXISTS (
        SELECT 1
        FROM discounts d
    WHERE d."itemId" = i."itemId"
    AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
    ) as "isOnSaleNow"
    FROM items i
    WHERE i."itemId" LIKE '%' || item_id || '%'
    AND (
        NOT is_on_sale OR EXISTS (
            SELECT 1
            FROM discounts
            WHERE discounts."itemId" = i."itemId"
            AND CURRENT_TIMESTAMP BETWEEN discounts."startDate" AND discounts."endDate"
        )
    );
END;
$$;