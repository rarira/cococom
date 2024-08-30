CREATE OR REPLACE FUNCTION get_items_with_wishlist_counts_by_id(item_id int4, user_id uuid, need_discounts boolean)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
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
    'memosLength', (
      CASE
        WHEN user_id IS NOT NULL THEN
          (SELECT COUNT(*)
          FROM memos m
          WHERE m."itemId" = i."id" AND m."userId" = user_id)
        ELSE
          NULL
      END
    ),
    'commentsLength', (
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
$$;
