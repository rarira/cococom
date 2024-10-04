CREATE OR REPLACE FUNCTION get_items_with_wishlist_counts(item_id text, user_id uuid, need_discounts boolean)
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
    'categories', c,
    'totalDiscountCount', i."totalDiscountCount",
    'totalWishlistCount', i."totalWishlistCount",
    'totalCommentCount', i."totalCommentCount",
    'is_online', i.is_online,
    -- 'discounts', (
    --   CASE
    --     WHEN need_discounts THEN
    --       (SELECT json_agg(d2)
    --       FROM discounts d2
    --       WHERE d2."itemId" = i."itemId")
    --     ELSE
    --       NULL
    --   END
    -- ),

    'totalMemoCount', (
      CASE
        WHEN user_id IS NOT NULL THEN
          (SELECT COUNT(*) FROM memos m WHERE m."itemId" = i.id AND m."userId" = user_id)
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
  WHERE i."itemId" = item_id;
  
  RETURN item;
END;
$$;