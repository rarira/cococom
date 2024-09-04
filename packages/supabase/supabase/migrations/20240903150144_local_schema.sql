drop function if exists "public"."get_alltime_top_items"(_user_id uuid, _order_by_column text, _order_by_direction text, _limit_count integer);

alter table "public"."items" add column "totalCommentCount" integer default 0;

alter table "public"."items" add column "totalWishlistCount" integer default 0;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_alltime_top_items(_user_id uuid, _order_by_column text DEFAULT 'created_at'::text, _order_by_direction text DEFAULT 'DESC'::text, _limit_count integer DEFAULT 50)
 RETURNS TABLE(id integer, "itemName" text, "itemId" text, created_at timestamp with time zone, updated_at timestamp with time zone, "bestDiscountRate" numeric, "lowestPrice" numeric, "bestDiscount" numeric, "totalWishlistCount" bigint, "totalCommentCount" bigint, "totalDiscountCount" bigint, "totalMemoCount" bigint, "isWishlistedByUser" boolean)
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
                i."totalWishlistCount",
                i."totalCommentCount",
                i."totalDiscountCount",
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

CREATE OR REPLACE FUNCTION public.get_items_with_wishlist_counts(item_id text, user_id uuid, need_discounts boolean)
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
    'categories', c,
    "totalDiscountCount", i."totalDiscountCount",
    "totalWishlistCount", i."totalWishlistCount",
    "totalCommentCount", i."totalCommentCount",
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
    "totalDiscountCount", i."totalDiscountCount",
    "totalWishlistCount", i."totalWishlistCount",
    "totalCommentCount", i."totalCommentCount",
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

CREATE OR REPLACE FUNCTION public.search_items_by_itemid(item_id text, is_on_sale boolean, user_id uuid, page integer, page_size integer, order_field text, order_direction text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    total_records INT := NULL;
    result JSONB;
    order_sql text;
BEGIN
    -- Validate order_direction
    IF order_direction NOT IN ('ASC', 'DESC') THEN
        RAISE EXCEPTION 'Invalid order direction: %', order_direction;
    END IF;

   -- Build dynamic order by clause with casting for itemId if needed
    IF order_field = 'itemId' THEN
        order_sql := format('ORDER BY i."itemId"::int4 %s', order_direction);
    ELSE
        order_sql := format('ORDER BY i.%I %s', order_field, order_direction);
    END IF;


    -- Calculate total records if page is 1
    IF page = 1 THEN
        EXECUTE format('
            SELECT COUNT(*)
            FROM items i
            WHERE i."itemId" LIKE ''%%'' || $1 || ''%%''
            AND (
                NOT $2 OR EXISTS (
                    SELECT 1
                    FROM discounts d
                    WHERE d."itemId" = i."itemId"
                    AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
                )
            )', order_field, order_direction)
        INTO total_records
        USING item_id, is_on_sale;
    END IF;

    -- Fetch paginated results with dynamic order
    EXECUTE format('
        SELECT jsonb_build_object(
            ''totalRecords'', $1,
            ''items'', (
                SELECT jsonb_agg(row_to_json(t))
                FROM (
                    SELECT i.id,
                        i."itemId",
                        i."itemName",
                        i."bestDiscountRate",
                        i."bestDiscount",
                        i."lowestPrice",
                        i."totalCommentCount",
                        i."totalWishlistCount",
                        EXISTS (
                            SELECT 1
                            FROM discounts d
                            WHERE d."itemId" = i."itemId"
                            AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
                        ) as "isOnSaleNow",
                        (
                            CASE
                                WHEN $4 IS NOT NULL THEN
                                (SELECT COUNT(*) FROM memos m WHERE m."itemId" = i.id AND m."userId" = $4)
                                ELSE
                                NULL
                            END                        
                        ) as "totalMemoCount",
                        (
                            CASE
                                WHEN $4 IS NOT NULL THEN
                                (SELECT EXISTS (SELECT 1 FROM wishlists w WHERE w."itemId" = i.id AND w."userId" = $4))
                                ELSE
                                NULL
                            END
                        ) as "isWishlistedByUser"
                    FROM items i
                    WHERE i."itemId" LIKE ''%%'' || $2 || ''%%''
                    AND (
                        NOT $3 OR EXISTS (
                            SELECT 1
                            FROM discounts
                            WHERE discounts."itemId" = i."itemId"
                            AND CURRENT_TIMESTAMP BETWEEN discounts."startDate" AND discounts."endDate"
                        )
                    )
                    %s
                    LIMIT $5 OFFSET ($6 - 1) * $5
                ) t
            )
        )', order_sql)
    INTO result
    USING total_records, item_id, is_on_sale, user_id, page_size, page;

    RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_items_by_keyword(keyword text, is_on_sale boolean, user_id uuid, page integer, page_size integer, order_field text, order_direction text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    total_records INT := NULL;
    result JSONB;
    order_sql text;
BEGIN
    -- Validate order_direction
    IF order_direction NOT IN ('ASC', 'DESC') THEN
        RAISE EXCEPTION 'Invalid order direction: %', order_direction;
    END IF;

   -- Build dynamic order by clause with casting for itemId if needed
    IF order_field = 'itemId' THEN
        order_sql := format('ORDER BY i."itemId"::int4 %s', order_direction);
    ELSE
        order_sql := format('ORDER BY i.%I %s', order_field, order_direction);
    END IF;

    -- Calculate total records if page is 1
    IF page = 1 THEN
        EXECUTE format('
            SELECT COUNT(*)
            FROM items i
            WHERE i."itemName" &@~ $1
            AND (
                NOT $2 OR EXISTS (
                    SELECT 1
                    FROM discounts d
                    WHERE d."itemId" = i."itemId"
                    AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
                )
            )', order_field, order_direction)
        INTO total_records
        USING keyword, is_on_sale;
    END IF;

    -- Fetch paginated results with dynamic order
    EXECUTE format('
        SELECT jsonb_build_object(
            ''totalRecords'', $1,
            ''items'', (
                SELECT jsonb_agg(row_to_json(t))
                FROM (
                    SELECT i.id,
                        i."itemId",
                        i."itemName",
                        i."bestDiscountRate",
                        i."bestDiscount",
                        i."lowestPrice",
                        i."totalCommentCount",
                        i."totalWishlistCount",
                        EXISTS (
                            SELECT 1
                            FROM discounts d
                            WHERE d."itemId" = i."itemId"
                            AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
                        ) as "isOnSaleNow",
                        (
                            CASE
                                WHEN $4 IS NOT NULL THEN
                                (SELECT COUNT(*) FROM memos m WHERE m."itemId" = i.id AND m."userId" = $4)
                                ELSE
                                NULL
                            END                        
                        ) as "totalMemoCount",
                        (
                            CASE
                                WHEN $4 IS NOT NULL THEN
                                (SELECT EXISTS (SELECT 1 FROM wishlists w WHERE w."itemId" = i.id AND w."userId" = $4))
                                ELSE
                                NULL
                            END
                        ) as "isWishlistedByUser"
                    FROM items i
                    WHERE i."itemName" &@~ $2
                    AND (
                        NOT $3 OR EXISTS (
                            SELECT 1
                            FROM discounts
                            WHERE discounts."itemId" = i."itemId"
                            AND CURRENT_TIMESTAMP BETWEEN discounts."startDate" AND discounts."endDate"
                        )
                    )
                    %s
                    LIMIT $5 OFFSET ($6 - 1) * $5
                ) t
            )
        )', order_sql)
    INTO result
    USING total_records, keyword, is_on_sale, user_id, page_size, page;

    RETURN result;
END;
$function$
;


