set check_function_bodies = off;

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
    'bestDiscount', i."bestDiscount",
    'lowestPrice', i."lowestPrice",
    'is_online', i.is_online,
    'online_url', i.online_url,
    'categories', json_build_object(
        'id', c.id,
        'categoryName', c."categoryName",
        'categorySector', c."categorySector"
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
    'totalDiscountCount', i."totalDiscountCount",
    'totalWishlistCount', i."totalWishlistCount",
    'totalCommentCount', i."totalCommentCount",
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


