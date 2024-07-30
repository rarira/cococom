CREATE OR REPLACE FUNCTION search_items_by_keyword(keyword text, is_on_sale boolean)
RETURNS SETOF items
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM items
    WHERE "itemName" &@~ keyword
    AND (
        NOT is_on_sale OR EXISTS (
            SELECT 1
            FROM discounts
            WHERE discounts."itemId" = items."itemId"
            AND CURRENT_TIMESTAMP BETWEEN discounts."startDate" AND discounts."endDate"
        )
    );
END;
$$;

CREATE OR REPLACE FUNCTION search_items_by_itemId(item_id text, is_on_sale boolean)
RETURNS SETOF items
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM items
    WHERE "itemId" LIKE '%' || item_id || '%'
    AND (
        NOT is_on_sale OR EXISTS (
            SELECT 1
            FROM discounts
            WHERE discounts."itemId" = items."itemId"
            AND CURRENT_TIMESTAMP BETWEEN discounts."startDate" AND discounts."endDate"
        )
    );
END;
$$;