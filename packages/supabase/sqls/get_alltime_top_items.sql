CREATE OR REPLACE FUNCTION get_alltime_top_items(
    _user_id uuid,
    _order_by_column text DEFAULT 'created_at',
    _order_by_direction text DEFAULT 'DESC',
    _limit_count int DEFAULT 50
)
RETURNS TABLE(
    id int,
    "itemName" text,
    "itemId" text,
    created_at timestamp with time zone,
    "bestDiscountRate" numeric,
    "lowestPrice" numeric,
    "bestDiscount" numeric,
    "totalWishlistCount" int,
    "totalCommentCount" int,
    "totalDiscountCount" int,
    "totalMemoCount" bigint,
    "isWishlistedByUser" boolean,
    "isOnSaleNow" boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY EXECUTE FORMAT(
        'WITH item_counts AS (
            SELECT
                i.id,
                i."itemName",
                i."itemId",
                i.created_at,
                i."bestDiscountRate",
                i."lowestPrice",
                i."bestDiscount",
                i."totalWishlistCount",
                i."totalCommentCount",
                i."totalDiscountCount",
                (
                    CASE
                        WHEN $1 IS NOT NULL THEN
                            (SELECT COUNT(*) FROM memos m WHERE m."itemId" = i.id AND m."userId" = $1)
                        ELSE
                            0
                    END
                ) as "totalMemoCount",
                (
                    CASE
                        WHEN $1 IS NOT NULL THEN
                            (SELECT EXISTS (SELECT 1 FROM wishlists w WHERE w."itemId" = i.id AND w."userId" = $1))
                        ELSE
                            FALSE
                    END
                ) as "isWishlistedByUser",
                (
                    SELECT EXISTS (
                        SELECT 1
                        FROM discounts d
                        WHERE d."itemId" = i."itemId"
                        AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
                        ORDER BY d."startDate" DESC
                        LIMIT 1
                    )
                ) as "isOnSaleNow"
            FROM
                items i
        )
        SELECT * FROM item_counts
        ORDER BY %I %s
        LIMIT %L',
        _order_by_column,
        _order_by_direction,
        _limit_count
    ) USING _user_id;
END;
$$;
