create or replace function get_discounts_with_wishlist_counts(_current_time_stamp timestamp, _user_id uuid)
returns TABLE(
    id int,
    "itemId" text,
    "startDate" timestamp without time zone,
    "endDate" timestamp without time zone,
    price numeric(65, 30),
    discount numeric(65, 30),
    "discountPrice" numeric(65, 30),
    "discountHash" text,
    "discountRate" numeric,
    items jsonb,
    "totalWishlistCount" numeric,
    "isWishlistedByUser" boolean
)
language sql
as $$
  SELECT
      d.*,
      to_json(
        json_build_object(
          'id', i.id,
          'itemId', i."itemId",
          'itemName', i."itemName",
          'categoryId', i."categoryId",
          'bestDiscountRate', i."bestDiscountRate",
          'lowestPrice', i."lowestPrice",
          'categories', to_json(c),
          'discounts', (
            SELECT json_agg(to_json(d2))
            FROM discounts d2
            WHERE d2."itemId" = i."itemId"
          )
        )
      ) AS items,
      (
        SELECT COUNT(*)
        FROM wishlists w
        WHERE w."itemId" = i.id
      ) AS "totalWishlistCount",
      CASE 
        WHEN _user_id IS NOT NULL THEN
            (SELECT EXISTS (SELECT 1 FROM wishlists w WHERE w."itemId" = i.id AND w."userId" = _user_id))
        ELSE
            NULL
      END AS "isWishlistedByUser"
  FROM
      discounts d
  LEFT JOIN items i ON d."itemId" = i."itemId"
  LEFT JOIN categories c ON i."categoryId" = c.id
  WHERE
      d."startDate" <= _current_time_stamp
      AND d."endDate" >= _current_time_stamp
$$