DROP FUNCTION get_discounted_ranking_with_wishlist_counts(
    _current_time_stamp timestamp, 
    _user_id uuid,
    _channel text,
    _limit int
);

CREATE OR REPLACE FUNCTION get_discounted_ranking_with_wishlist_counts(
    _current_time_stamp timestamp, 
    _user_id uuid,
    _channel text,
    _limit int
)
RETURNS TABLE(
    id int,
    "startDate" timestamp without time zone,
    "endDate" timestamp without time zone,
    price numeric(65, 30),
    "discountPrice" numeric(65, 30),
    "discountRate" numeric,
    "discount" numeric,
    is_online boolean,
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
        d."discount",
        d.is_online,
        get_items_with_wishlist_counts(d."itemId", $1, false) AS items
    FROM
        discounts d
    LEFT JOIN items i ON d."itemId" = i."itemId"
    WHERE
        d."startDate" <= $2
        AND d."endDate" >= $2' ||
    CASE
        WHEN _channel = 'online' THEN
            ' AND d.is_online = TRUE'
        WHEN _channel = 'offline' THEN
            ' AND d.is_online = FALSE'
        ELSE
            ''  -- 'all'일 경우 조건 없음
    END ||
    ' ORDER BY d."discountRate" DESC' ||
    ' LIMIT $3'
    USING _user_id, _current_time_stamp, _limit;
END;
$$;