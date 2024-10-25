-- DROP FUNCTION search_items_by_keyword(
--     keyword text, 
--     is_on_sale boolean, 
--     user_id uuid, 
--     page int, 
--     page_size int, 
--     order_field text, 
--     order_direction text
-- );

CREATE OR REPLACE FUNCTION search_items_by_keyword(
    keyword text, 
    is_on_sale boolean, 
    user_id uuid, 
    page int, 
    page_size int, 
    order_field text, 
    order_direction text,
    channel text
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
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
$$;

-- DROP FUNCTION search_items_by_itemId(
--     item_id text, 
--     is_on_sale boolean, 
--     user_id uuid, 
--     page int, 
--     page_size int, 
--     order_field text, 
--     order_direction text
-- );

CREATE OR REPLACE FUNCTION search_items_by_itemId(
    item_id text, 
    is_on_sale boolean, 
    user_id uuid, 
    page int, 
    page_size int, 
    order_field text, 
    order_direction text,
    channel text
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
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
$$;
