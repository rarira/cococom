drop function if exists "public"."get_discounted_ranking_with_wishlist_counts"(_current_time_stamp timestamp without time zone, _user_id uuid, _channel text, _limit integer);

alter table "public"."wishlists" add column "wishlist_hash" text not null;

CREATE UNIQUE INDEX wishlists_wishlist_hash_key ON public.wishlists USING btree (wishlist_hash);

alter table "public"."wishlists" add constraint "wishlists_wishlist_hash_key" UNIQUE using index "wishlists_wishlist_hash_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_discounted_ranking_with_wishlist_counts(_current_time_stamp timestamp without time zone, _user_id uuid, _channel text, _limit integer, _order_field text, _order_direction text)
 RETURNS TABLE(id integer, "startDate" timestamp without time zone, "endDate" timestamp without time zone, price numeric, "discountPrice" numeric, "discountRate" numeric, discount numeric, is_online boolean, items jsonb)
 LANGUAGE plpgsql
AS $function$
DECLARE
    order_sql text;
    base_field text;
BEGIN
    -- Validate order direction
    IF _order_direction NOT IN ('asc', 'desc') THEN
        RAISE EXCEPTION 'Invalid order direction: %', _order_direction;
    END IF;

    -- Determine whether the order field refers to items (i) or discounts (d)
    IF _order_field LIKE 'items.%' THEN
        base_field := format('i."%s"', split_part(_order_field, '.', 2));  -- Extract and quote "xxxx" from "items.xxxx"
    ELSE
        base_field := format('d."%s"', _order_field);  -- Quote and use "d.yyyy" directly
    END IF;

    -- Build dynamic order clause
    order_sql := format('ORDER BY %s %s', base_field, _order_direction);

  RETURN QUERY EXECUTE
    format(
        'SELECT
            d.id,
            d."startDate",
            d."endDate",
            d.price,
            d."discountPrice",
            d."discountRate",
            d."discount",
            d.is_online,
            get_items_with_wishlist_counts(d."itemId", $1, false) AS items
        FROM
            discounts d
        LEFT JOIN items i ON d."itemId" = i."itemId"
        WHERE
            d."startDate" <= $2
            AND d."endDate" >= $2
            %s
        %s
        LIMIT $3',
        CASE
            WHEN _channel = 'online' THEN 'AND d.is_online = TRUE'
            WHEN _channel = 'offline' THEN 'AND d.is_online = FALSE'
            ELSE ''
        END,
        order_sql
    )
    USING _user_id, _current_time_stamp, _limit;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_wishlist_items(user_id uuid, is_on_sale boolean, page integer, page_size integer, order_field text, order_direction text, channel text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    total_records INT := NULL;
    result JSONB;
    order_sql TEXT;
    channel_sql TEXT;  
    sale_condition_sql TEXT;
BEGIN
    -- Validate order_direction
    IF order_direction NOT IN ('ASC', 'DESC') THEN
        RAISE EXCEPTION 'Invalid order direction: %', order_direction;
    END IF;

    -- Build dynamic order by clause
    IF order_field = 'itemId' THEN
        order_sql := format(
            'ORDER BY 
                COALESCE(NULLIF(regexp_replace(i."itemId", ''[^0-9]'', '''', ''g''), '''')::bigint, 0) %s,
                (i."itemId" LIKE ''%%_online%%'') ASC',
            order_direction
        );
    ELSIF order_field = 'wishlistCreatedAt' THEN
        order_sql := format('ORDER BY w.created_at %s', order_direction);
    ELSIF order_field = 'endDate' THEN
        order_sql := format('ORDER BY d."endDate" %s', order_direction);
    ELSE
        order_sql := format('ORDER BY i.%I %s', order_field, order_direction);
    END IF;

    -- Build channel-specific SQL condition
    channel_sql := CASE channel
        WHEN 'online' THEN 'AND i.is_online = TRUE'
        WHEN 'offline' THEN 'AND i.is_online = FALSE'
        ELSE ''  -- 'all'일 경우 조건 없음
    END;

    -- Build sale condition SQL dynamically
    sale_condition_sql := 
        CASE 
            WHEN is_on_sale IS TRUE THEN 
                'AND d.id IS NOT NULL'  -- 할인이 있는 경우에만 반환
            ELSE ''
        END;

    -- Calculate total records if page is 1
    IF page = 1 THEN
        EXECUTE format('
            SELECT COUNT(*)
            FROM wishlists w
            LEFT JOIN items i ON i.id = w."itemId"
            LEFT JOIN discounts d ON d."itemId" = i."itemId"
                AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
            WHERE w."userId" = $1
            %s  -- Sale condition
            %s  -- Channel condition
        ', sale_condition_sql, channel_sql) 
        INTO total_records
        USING user_id;
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
                           i."totalWishlistCount",
                           i."totalCommentCount",
                           i."totalDiscountCount",
                           i.is_online,
                           w."created_at" AS "wishlistCreatedAt",
                           w.id AS "wishlistId",
                           CASE 
                               WHEN d.id IS NOT NULL THEN TRUE 
                               ELSE FALSE 
                           END AS "isOnSaleNow",
                           -- Create discount object
                           CASE 
                               WHEN d.id IS NOT NULL THEN 
                                   jsonb_build_object(
                                       ''discount'', d.discount,
                                       ''discountRate'', d."discountRate",
                                       ''discountPrice'', d."discountPrice",
                                       ''endDate'', d."endDate"
                                       
                                   )
                               ELSE NULL
                           END AS discount
                    FROM wishlists w
                    LEFT JOIN items i ON i.id = w."itemId"
                    LEFT JOIN discounts d ON d."itemId" = i."itemId"
                        AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
                    WHERE w."userId" = $2
                    %s  -- Sale condition
                    %s  -- Channel condition
                    %s  -- Order by clause
                    LIMIT $3 OFFSET ($4 - 1) * $3
                ) t
            )
        )',
        sale_condition_sql, channel_sql, order_sql)
    INTO result
    USING total_records, user_id, page_size, page;

    RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_items_by_itemid(item_id text, is_on_sale boolean, user_id uuid, page integer, page_size integer, order_field text, order_direction text, channel text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    total_records INT := NULL;
    result JSONB;
    order_sql text;
    channel_sql text;  -- 동적으로 조건을 구성할 변수
BEGIN
    -- Validate order_direction
    IF order_direction NOT IN ('ASC', 'DESC') THEN
        RAISE EXCEPTION 'Invalid order direction: %', order_direction;
    END IF;

   -- Build dynamic order by clause with casting for itemId if needed
    IF order_field = 'itemId' THEN
        order_sql := format(
            'ORDER BY 
                COALESCE(NULLIF(regexp_replace(i."itemId", ''[^0-9]'', '''', ''g''), '''')::bigint, 0) %s,
                (i."itemId" LIKE ''%%_online%%'') ASC',
            order_direction
        );
    ELSE
        order_sql := format('ORDER BY i.%I %s', order_field, order_direction);
    END IF;

    -- Build channel-specific SQL condition
    channel_sql := CASE channel
        WHEN 'online' THEN 'AND i.is_online = TRUE'
        WHEN 'offline' THEN 'AND i.is_online = FALSE'
        ELSE ''  -- 'all'일 경우 조건 없음
    END;

    -- Calculate total records if page is 1
    IF page = 1 THEN
        EXECUTE format('
            SELECT COUNT(*)
            FROM items i
            WHERE i."itemId" LIKE ''%%'' || $1 || ''%%''
            AND (
                NOT $2::boolean OR EXISTS (
                    SELECT 1
                    FROM discounts d
                    WHERE d."itemId" = i."itemId"
                    AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
                )
            )
            %s', channel_sql) 
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
                        i.is_online,
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
                        NOT $3::boolean OR EXISTS (
                            SELECT 1
                            FROM discounts
                            WHERE discounts."itemId" = i."itemId"
                            AND CURRENT_TIMESTAMP BETWEEN discounts."startDate" AND discounts."endDate"
                        )
                    )
                    %s
                    %s
                    LIMIT $5 OFFSET ($6 - 1) * $5
                ) t
            )
        )', channel_sql, order_sql)
    INTO result
    USING total_records, item_id, is_on_sale, user_id, page_size, page;

    RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.search_items_by_keyword(keyword text, is_on_sale boolean, user_id uuid, page integer, page_size integer, order_field text, order_direction text, channel text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    total_records INT := NULL;
    result JSONB;
    order_sql text;
    channel_sql text;  -- 동적으로 조건을 구성할 변수
BEGIN
    -- Validate order_direction
    IF order_direction NOT IN ('ASC', 'DESC') THEN
        RAISE EXCEPTION 'Invalid order direction: %', order_direction;
    END IF;

   -- Build dynamic order by clause with casting for itemId if needed
    IF order_field = 'itemId' THEN
        order_sql := format(
            'ORDER BY 
                COALESCE(NULLIF(regexp_replace(i."itemId", ''[^0-9]'', '''', ''g''), '''')::bigint, 0) %s,
                (i."itemId" LIKE ''%%_online%%'') ASC',
            order_direction
        );
    ELSE
        order_sql := format('ORDER BY i.%I %s', order_field, order_direction);
    END IF;

    -- Build channel-specific SQL condition
    channel_sql := CASE channel
        WHEN 'online' THEN 'AND i.is_online = TRUE'
        WHEN 'offline' THEN 'AND i.is_online = FALSE'
        ELSE ''  -- 'all'일 경우 조건 없음
    END;

    -- Calculate total records if page is 1
    IF page = 1 THEN
        EXECUTE format('
            SELECT COUNT(*)
            FROM items i
            WHERE i."itemName" &@~ $1
            AND (
                NOT $2::boolean OR EXISTS (
                    SELECT 1
                    FROM discounts d
                    WHERE d."itemId" = i."itemId"
                    AND (CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate")
                )
            )
            %s', channel_sql)
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
                        i.is_online,
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
                        NOT $3::boolean OR EXISTS (
                            SELECT 1
                            FROM discounts
                            WHERE discounts."itemId" = i."itemId"
                            AND CURRENT_TIMESTAMP BETWEEN discounts."startDate" AND discounts."endDate"
                        )
                    )
                    %s
                    %s
                    LIMIT $5 OFFSET ($6 - 1) * $5
                ) t
            )
        )', channel_sql,order_sql)
    INTO result
    USING total_records, keyword, is_on_sale, user_id, page_size, page;

    RETURN result;
END;
$function$
;


