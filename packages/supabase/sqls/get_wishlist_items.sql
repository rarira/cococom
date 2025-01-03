DROP FUNCTION IF EXISTS get_wishlist_items(
    user_id uuid, 
    is_on_sale boolean, 
    page int, 
    page_size int, 
    order_field text, 
    order_direction text,
    channel text
);

CREATE OR REPLACE FUNCTION get_wishlist_items(
    user_id uuid, 
    is_on_sale boolean, 
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
    IF page = 0 THEN
        EXECUTE format('
            SELECT COUNT(*)
            FROM wishlists w
            LEFT JOIN items i ON i.id = w."itemId"
            LEFT JOIN (
                SELECT DISTINCT ON ("itemId") *
                FROM discounts
                WHERE CURRENT_TIMESTAMP BETWEEN "startDate" AND "endDate"
                ORDER BY "itemId", "endDate" DESC
            ) d ON d."itemId" = i."itemId"
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
                    LEFT JOIN (
                        SELECT DISTINCT ON ("itemId") *
                        FROM discounts
                        WHERE CURRENT_TIMESTAMP BETWEEN "startDate" AND "endDate"
                        ORDER BY "itemId", "endDate" DESC
                    ) d ON d."itemId" = i."itemId"
                    WHERE w."userId" = $2
                    %s  -- Sale condition
                    %s  -- Channel condition
                    %s  -- Order by clause
                    LIMIT $3 OFFSET $4 * $3
                ) t
            )
        )',
        sale_condition_sql, channel_sql, order_sql)
    INTO result
    USING total_records, user_id, page_size, page;

    RETURN result;
END;
$$;
