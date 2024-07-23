CREATE OR REPLACE FUNCTION get_current_discounts_by_category_sector(_current_time_stamp timestamp)
RETURNS TABLE(
    id int,
    "itemId" text,
    "categorySector" public."CategorySectors",
    "discountsCount" bigint
)
LANGUAGE plpgsql
AS $$
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
$$;
