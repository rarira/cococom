DROP FUNCTION IF EXISTS get_current_discounts_by_category_sector(_current_time_stamp timestamp);

CREATE OR REPLACE FUNCTION get_current_discounts_by_category_sector(_current_time_stamp timestamp)
RETURNS TABLE(
    id int,
    "itemId" text,
    "categorySector" public."CategorySectors",
    "discountsCountOnline" bigint,
    "discountsCountOffline" bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH discount_counts_online AS (
        SELECT
            c."categorySector",
            COUNT(d.id) AS "discountsCountOnline"
        FROM
            discounts d
        LEFT JOIN items i ON d."itemId" = i."itemId"
        LEFT JOIN categories c ON i."categoryId" = c.id
        WHERE
            d."startDate" <= _current_time_stamp
            AND d."endDate" >= _current_time_stamp
            AND d.is_online = true
        GROUP BY c."categorySector"
    ),
    discount_counts_offline AS (
        SELECT
            c."categorySector",
            COUNT(d.id) AS "discountsCountOffline"
        FROM
            discounts d
        LEFT JOIN items i ON d."itemId" = i."itemId"
        LEFT JOIN categories c ON i."categoryId" = c.id
        WHERE
            d."startDate" <= _current_time_stamp
            AND d."endDate" >= _current_time_stamp
            AND d.is_online = false
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
        dcon."discountsCountOnline",
        dcoff."discountsCountOffline"
    FROM
        distinct_discounts dd
    LEFT JOIN discount_counts_online dcon ON dd."categorySector" = dcon."categorySector"
    LEFT JOIN discount_counts_offline dcoff ON dd."categorySector" = dcoff."categorySector"
    ORDER BY (dcon."discountsCountOnline" + dcoff."discountsCountOffline") DESC;
END;
$$;
