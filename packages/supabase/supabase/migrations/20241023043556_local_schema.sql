set check_function_bodies = off;

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
        order_sql := format('ORDER BY i."itemId"::int4 %s', order_direction);
    ELSIF order_field = 'wishlistCreatedAt' THEN
        order_sql := format('ORDER BY w."created_at" %s', order_direction);
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
                'AND EXISTS (
                    SELECT 1
                    FROM discounts d
                    WHERE d."itemId" = i."itemId"
                    AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
                )'
            ELSE ''
        END;

    -- Calculate total records if page is 1
    IF page = 1 THEN
        EXECUTE format('
            SELECT COUNT(*)
            FROM wishlists w
            LEFT JOIN items i ON i.id = w."itemId"
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
                           (
                               SELECT EXISTS (
                                   SELECT 1
                                   FROM discounts d
                                   WHERE d."itemId" = i."itemId"
                                   AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
                                   ORDER BY d."startDate" DESC
                                   LIMIT 1
                               )
                           ) AS "isOnSaleNow"
                    FROM wishlists w
                    LEFT JOIN items i ON i.id = w."itemId"
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
        order_sql := format('ORDER BY i."itemId"::int4 %s', order_direction);
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
        order_sql := format('ORDER BY i."itemId"::int4 %s', order_direction);
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

