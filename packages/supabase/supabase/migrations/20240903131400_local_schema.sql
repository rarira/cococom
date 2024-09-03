drop function if exists "public"."get_alltime_top_items"(_user_id uuid, _order_by_column text, _order_by_direction text, _limit_count integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_alltime_top_items(_user_id uuid, _order_by_column text DEFAULT 'created_at'::text, _order_by_direction text DEFAULT 'DESC'::text, _limit_count integer DEFAULT 50)
 RETURNS TABLE(id integer, "itemName" text, "itemId" text, created_at timestamp with time zone, updated_at timestamp with time zone, "bestDiscountRate" numeric, "lowestPrice" numeric, "bestDiscount" numeric, "totalWishlistCount" bigint, "totalCommentCount" bigint, "totalMemoCount" bigint, "isWishlistedByUser" boolean, "discountsLength" bigint)
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
                i.updated_at,
                i."bestDiscountRate",
                i."lowestPrice",
                i."bestDiscount",
                (
                    SELECT COUNT(*)
                    FROM wishlists w
                    WHERE w."itemId" = i.id
                ) as "totalWishlistCount",
                (
                    SELECT COUNT(*)
                    FROM comments c
                    WHERE c."item_id" = i.id
                ) as "totalCommentCount",
                (
                    CASE
                        WHEN $1 IS NOT NULL THEN
                        (SELECT COUNT(*) FROM memos m WHERE m."itemId" = i.id AND m."userId" = $1)
                        ELSE
                        NULL
                    END
                ) as "totalMemoCount",
                (
                    CASE
                        WHEN $1 IS NOT NULL THEN
                        (SELECT EXISTS (SELECT 1 FROM wishlists w WHERE w."itemId" = i.id AND w."userId" = $1))
                        ELSE
                        NULL
                    END
                ) as "isWishlistedByUser",
                (
                    SELECT COUNT(*)
                    FROM discounts d
                    WHERE d."itemId" = i."itemId"
                ) as "discountsLength"
            FROM
                items i
        )
        SELECT * FROM item_counts
        ORDER BY %I %s
        LIMIT %s',
        _order_by_column,
        _order_by_direction,
        _limit_count
    ) USING _user_id;
END;
$function$
;


