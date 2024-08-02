CREATE OR REPLACE FUNCTION search_items_by_keyword(keyword text, is_on_sale boolean, user_id uuid, page int, page_size int)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    total_records INT := NULL;
    result JSONB;
BEGIN
    -- 페이지가 1인 경우에만 전체 레코드 수를 계산
    IF page = 1 THEN
        SELECT COUNT(*) INTO total_records
        FROM items i
        WHERE i."itemName" &@~ keyword
        AND (
            NOT is_on_sale OR EXISTS (
                SELECT 1
                FROM discounts d
                WHERE d."itemId" = i."itemId"
                AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
            )
        );
    END IF;

    -- 페이징된 결과와 전체 레코드 수 반환
    result := json_build_object(
        'totalRecords', total_records,
        'items', (
            SELECT json_agg(row_to_json(t))
            FROM (
                SELECT i.id,
                    i."itemId",
                    i."itemName",
                    i."bestDiscountRate",
                    i."bestDiscount",
                    i."lowestPrice",
                    EXISTS (
                        SELECT 1
                        FROM discounts d
                        WHERE d."itemId" = i."itemId"
                        AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
                    ) as "isOnSaleNow",
                    (
                        SELECT COUNT(*)
                        FROM wishlists w
                        WHERE w."itemId" = i.id
                        ) as "totalWishlistCount",
                    (
                        CASE
                            WHEN user_id IS NOT NULL THEN
                            (SELECT EXISTS (SELECT 1 FROM wishlists w WHERE w."itemId" = i.id AND w."userId" = user_id))
                            ELSE
                            NULL
                        END
                    ) as "isWishlistedByUser"
                FROM items i
                WHERE i."itemName" &@~ keyword
                AND (
                    NOT is_on_sale OR EXISTS (
                        SELECT 1
                        FROM discounts
                        WHERE discounts."itemId" = i."itemId"
                        AND CURRENT_TIMESTAMP BETWEEN discounts."startDate" AND discounts."endDate"
                    )
                )
                LIMIT page_size OFFSET (page - 1) * page_size
            ) t
        )
    );

    RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION search_items_by_itemId(item_id text, is_on_sale boolean, user_id uuid, page int, page_size int)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    total_records INT := NULL;
    result JSONB;
BEGIN
    -- 페이지가 1인 경우에만 전체 레코드 수를 계산
    IF page = 1 THEN
        SELECT COUNT(*) INTO total_records
        FROM items i
        WHERE i."itemId" LIKE '%' || item_id || '%'
        AND (
            NOT is_on_sale OR EXISTS (
                SELECT 1
                FROM discounts d
                WHERE d."itemId" = i."itemId"
                AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
            )
        );
    END IF;

     -- 페이징된 결과와 전체 레코드 수 반환
    result := json_build_object(
        'totalRecords', total_records,
        'items', (
            SELECT json_agg(row_to_json(t))
            FROM (
                SELECT i.id,
                    i."itemId",
                    i."itemName",
                    i."bestDiscountRate",
                    i."bestDiscount",
                    i."lowestPrice",
                    EXISTS (
                        SELECT 1
                        FROM discounts d
                        WHERE d."itemId" = i."itemId"
                        AND CURRENT_TIMESTAMP BETWEEN d."startDate" AND d."endDate"
                    ) as "isOnSaleNow",
                    (
                        SELECT COUNT(*)
                        FROM wishlists w
                        WHERE w."itemId" = i.id
                        ) as "totalWishlistCount",
                    (
                        CASE
                            WHEN user_id IS NOT NULL THEN
                            (SELECT EXISTS (SELECT 1 FROM wishlists w WHERE w."itemId" = i.id AND w."userId" = user_id))
                            ELSE
                            NULL
                        END
                    ) as "isWishlistedByUser"
                FROM items i
                WHERE i."itemId" LIKE '%' || item_id || '%'
                AND (
                    NOT is_on_sale OR EXISTS (
                        SELECT 1
                        FROM discounts
                        WHERE discounts."itemId" = i."itemId"
                        AND CURRENT_TIMESTAMP BETWEEN discounts."startDate" AND discounts."endDate"
                    )
                )
                LIMIT page_size OFFSET (page - 1) * page_size
            ) t
        )
    );

    RETURN result;
END;
$$;