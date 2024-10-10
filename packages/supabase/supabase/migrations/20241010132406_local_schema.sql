drop function if exists "public"."get_current_discounts_by_category_sector"(_current_time_stamp timestamp without time zone);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_latest_histories()
 RETURNS TABLE(id bigint, created_at timestamp with time zone, new_item_count integer, added_discount_count integer, is_online boolean)
 LANGUAGE plpgsql
AS $function$
begin
    return query
    (
        -- 최신의 is_online = false 레코드
        select h.id, h.created_at, h.new_item_count, h.added_discount_count, h.is_online
        from public.histories h
        where h.is_online = false
        order by h.created_at desc
        limit 1
    );
    return query
    (
        -- 최신의 is_online = true 레코드
        select h.id, h.created_at, h.new_item_count, h.added_discount_count, h.is_online
        from public.histories h
        where h.is_online = true
        order by h.created_at desc
        limit 1
    );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_current_discounts_by_category_sector(_current_time_stamp timestamp without time zone)
 RETURNS TABLE(id integer, "itemId" text, "categorySector" "CategorySectors", "discountsCountOnline" bigint, "discountsCountOffline" bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH discount_counts_online AS (
        SELECT
            c."categorySector",
            COUNT(d.id) AS "discountsCountOnline"
        FROM
            discounts d
        LEFT JOIN items i ON d."itemId" = i."itemId"
        LEFT JOIN categories c ON i."categoryId" = c.id
        WHERE
            d."startDate" <= _current_time_stamp
            AND d."endDate" >= _current_time_stamp
            AND d.is_online = true
        GROUP BY c."categorySector"
    ),
    discount_counts_offline AS (
        SELECT
            c."categorySector",
            COUNT(d.id) AS "discountsCountOffline"
        FROM
            discounts d
        LEFT JOIN items i ON d."itemId" = i."itemId"
        LEFT JOIN categories c ON i."categoryId" = c.id
        WHERE
            d."startDate" <= _current_time_stamp
            AND d."endDate" >= _current_time_stamp
            AND d.is_online = false
        GROUP BY c."categorySector"
    ),
    distinct_discounts AS (
        SELECT DISTINCT ON (c."categorySector")
            d.id,
            d."itemId",
            d."discountRate",
            c."categorySector"
        FROM
            discounts d
        LEFT JOIN items i ON d."itemId" = i."itemId"
        LEFT JOIN categories c ON i."categoryId" = c.id
        WHERE
            d."startDate" <= _current_time_stamp
            AND d."endDate" >= _current_time_stamp
        ORDER BY c."categorySector", d."discountRate" DESC
    )
    SELECT
        dd.id,
        dd."itemId",
        dd."categorySector",
        dcon."discountsCountOnline",
        dcoff."discountsCountOffline"
    FROM
        distinct_discounts dd
    LEFT JOIN discount_counts_online dcon ON dd."categorySector" = dcon."categorySector"
    LEFT JOIN discount_counts_offline dcoff ON dd."categorySector" = dcoff."categorySector"
    ORDER BY (dcon."discountsCountOnline" + dcoff."discountsCountOffline") DESC;
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
    'bestDiscount', i."bestDiscount",
    'lowestPrice', i."lowestPrice",
    'is_online', i.is_online,
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


