set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_discounts_with_wishlist_counts(_current_time_stamp timestamp without time zone, _user_id uuid, _category_sector "CategorySectors")
 RETURNS TABLE(id integer, "startDate" timestamp without time zone, "endDate" timestamp without time zone, price numeric, "discountPrice" numeric, "discountRate" numeric, items jsonb)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY EXECUTE
    'SELECT
        d.id,
        d."startDate",
        d."endDate",
        d.price,
        d."discountPrice",
        d."discountRate",
        get_items_with_wishlist_counts(d."itemId", $1, false) AS items
    FROM
        discounts d
    LEFT JOIN items i ON d."itemId" = i."itemId"
    LEFT JOIN categories c ON i."categoryId" = c.id
    WHERE
        d."startDate" <= $2
        AND d."endDate" >= $2' ||
    CASE
        WHEN _category_sector IS NOT NULL THEN
            ' AND c."categorySector" = $3'
        ELSE
            ''
    END
    USING _user_id, _current_time_stamp, _category_sector;
END;
$function$
;


