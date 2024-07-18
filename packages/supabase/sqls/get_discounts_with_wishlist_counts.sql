CREATE OR REPLACE FUNCTION get_discounts_with_wishlist_counts(
    _current_time_stamp timestamp, 
    _user_id uuid,
    _category_sector public."CategorySectors"
)
RETURNS TABLE(
    id int,
    "startDate" timestamp without time zone,
    "endDate" timestamp without time zone,
    price numeric(65, 30),
    "discountPrice" numeric(65, 30),
    "discountRate" numeric,
    items jsonb
)
LANGUAGE plpgsql
AS $$
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
$$;