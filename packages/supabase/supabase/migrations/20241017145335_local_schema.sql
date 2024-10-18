drop function if exists "public"."get_alltime_top_items"(_user_id uuid, _order_by_column text, _order_by_direction text, _limit_count integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_alltime_top_items(_channel text, _user_id uuid, _order_by_column text, _order_by_direction text, _limit_count integer)
 RETURNS TABLE(id integer, "itemName" text, "itemId" text, created_at timestamp with time zone, "bestDiscountRate" numeric, "lowestPrice" numeric, "bestDiscount" numeric, "totalWishlistCount" integer, "totalCommentCount" integer, "totalDiscountCount" integer, "totalMemoCount" bigint, "isWishlistedByUser" boolean, "isOnSaleNow" boolean, is_online boolean)
 LANGUAGE plpgsql
AS $function$
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
                ) as "isOnSaleNow",
                i.is_online
            FROM
                items i
            %s
        )
        SELECT * FROM item_counts
        ORDER BY %I %s
        LIMIT %L',
        CASE
            WHEN _channel = 'online' THEN 'WHERE i.is_online = TRUE'
            WHEN _channel = 'offline' THEN 'WHERE i.is_online = FALSE'
            ELSE ''  -- 'all'일 경우 WHERE 절 없음
        END,
        _order_by_column,
        _order_by_direction,
        _limit_count
    ) USING _user_id;
END;
$function$
;


