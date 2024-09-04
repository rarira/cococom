set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_alltime_top_items(_user_id uuid, _order_by_column text DEFAULT 'created_at'::text, _order_by_direction text DEFAULT 'DESC'::text, _limit_count integer DEFAULT 50)
 RETURNS TABLE(id integer, "itemName" text, "itemId" text, created_at timestamp with time zone, updated_at timestamp with time zone, "bestDiscountRate" numeric, "lowestPrice" numeric, "bestDiscount" numeric, "totalWishtlistCount" bigint, "totalCommentCount" bigint, "totalMemoCount" bigint, "isWishlistedByUser" boolean)
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
                ) as "totalWishtlistCount",
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
                ) as "isWishlistedByUser"
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

CREATE OR REPLACE FUNCTION public.get_items_with_wishlist_counts_by_id(item_id integer, user_id uuid, need_discounts boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
  item jsonb;
BEGIN
  SELECT to_json(json_build_object(
    'id', i.id,
    'itemId', i."itemId",
    'itemName', i."itemName",
    'categoryId', i."categoryId",
    'bestDiscountRate', i."bestDiscountRate",
    'lowestPrice', i."lowestPrice",
    'categories', json_build_object(
        'id', c.id,
        'categoryName', c."categoryName",
        'categorySector', c."categorySector"
    ),
    'discountsLength', (
      SELECT COUNT(*)
      FROM discounts d
      WHERE d."itemId" = i."itemId"
    ),
    'discounts', (
      CASE
        WHEN need_discounts THEN
          (SELECT json_agg(sorted_discounts)
          FROM (
            SELECT *
            FROM discounts d2
            WHERE d2."itemId" = i."itemId"
            ORDER BY d2."startDate" DESC
            LIMIT 10
          ) AS sorted_discounts)
        ELSE
          NULL
      END
    ),
    'totalMemoCount', (
      CASE
        WHEN user_id IS NOT NULL THEN
          (SELECT COUNT(*)
          FROM memos m
          WHERE m."itemId" = i."id" AND m."userId" = user_id)
        ELSE
          NULL
      END
    ),
    'totalCommentCount', (
      SELECT COUNT(*)
      FROM comments c
      WHERE c."item_id" = i."id"
    ),
    'totalWishlistCount', (
      SELECT COUNT(*)
      FROM wishlists w
      WHERE w."itemId" = i.id
    ),
    'isWishlistedByUser', (
      CASE
        WHEN user_id IS NOT NULL THEN
          (SELECT EXISTS (SELECT 1 FROM wishlists w WHERE w."itemId" = i.id AND w."userId" = user_id))
        ELSE
          NULL
      END
    )
  ))
  INTO item
  FROM items i
  LEFT JOIN categories c ON i."categoryId" = c.id
  WHERE i."id" = item_id;
  
  RETURN item;
END;
$function$
;


