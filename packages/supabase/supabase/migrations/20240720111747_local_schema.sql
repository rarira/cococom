drop function if exists "public"."get_discounts_with_wishlist_counts"(_current_time_stamp timestamp without time zone, _user_id uuid);

drop function if exists "public"."get_items_with_wishlist_counts"(item_id text, user_id uuid);

drop function if exists "public"."get_discounts_with_wishlist_counts"(_current_time_stamp timestamp without time zone, _user_id uuid, _category_sector "CategorySectors");

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_current_discounts_by_category_sector(_current_time_stamp timestamp without time zone)
 RETURNS TABLE(id integer, "itemId" text, "categorySector" "CategorySectors", "discountsCount" bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH discount_counts AS (
        SELECT
            c."categorySector",
            COUNT(d.id) AS "discountsCount"
        FROM
            discounts d
        LEFT JOIN items i ON d."itemId" = i."itemId"
        LEFT JOIN categories c ON i."categoryId" = c.id
        WHERE
            d."startDate" <= _current_time_stamp
            AND d."endDate" >= _current_time_stamp
        GROUP BY c."categorySector"
    ),
    distinct_discounts AS (
        SELECT DISTINCT ON (c."categorySector")
            d.id,
            d."itemId",
            d."discountRate",
            c."categorySector"
        FROM
            discounts d
        LEFT JOIN items i ON d."itemId" = i."itemId"
        LEFT JOIN categories c ON i."categoryId" = c.id
        WHERE
            d."startDate" <= _current_time_stamp
            AND d."endDate" >= _current_time_stamp
        ORDER BY c."categorySector", d."discountRate" DESC
    )
    SELECT
        dd.id,
        dd."itemId",
        dd."categorySector",
        dc."discountsCount"
    FROM
        distinct_discounts dd
    LEFT JOIN discount_counts dc ON dd."categorySector" = dc."categorySector"
    ORDER BY dc."discountsCount" DESC;
END;
$function$
;

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
    END ||
    ' ORDER BY d."discountRate" DESC'
    USING _user_id, _current_time_stamp, _category_sector;
END;
$function$
;


