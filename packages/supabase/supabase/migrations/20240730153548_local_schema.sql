create extension if not exists "pgroonga" with schema "extensions";


CREATE INDEX ix_items_content ON public.items USING pgroonga ("itemName");

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.search_items_by_itemid(item_id text, is_on_sale boolean)
 RETURNS TABLE(id integer, "itemId" text, "itemName" text, "bestDiscountRate" numeric, "bestDiscount" numeric, "lowestPrice" numeric, "isOnSaleNow" boolean)
 LANGUAGE plpgsql
AS $function$
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
        WHERE d."itemId" = i.id
        AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
    ) as "isOnSaleNow"
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
$function$
;

CREATE OR REPLACE FUNCTION public.search_items_by_keyword(keyword text, is_on_sale boolean)
 RETURNS TABLE(id integer, "itemId" text, "itemName" text, "bestDiscountRate" numeric, "bestDiscount" numeric, "lowestPrice" numeric, "isOnSaleNow" boolean)
 LANGUAGE plpgsql
AS $function$
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
        WHERE d."itemId" = i.id
        AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
    ) as "isOnSaleNow"
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
$function$
;


