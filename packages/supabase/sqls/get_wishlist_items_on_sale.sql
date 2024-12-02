CREATE OR REPLACE FUNCTION get_current_discounted_wishlist_items(user_uuid UUID)
RETURNS TABLE (
    item_id INTEGER,
    item_external_id TEXT,
    item_name TEXT,
    category_id INTEGER,
    lowest_price NUMERIC,
    best_discount_rate NUMERIC,
    is_online BOOLEAN,
    online_url TEXT
) AS
$$
WITH current_discounts AS (
    SELECT
        d."itemId" AS discount_item_id
    FROM
        public.discounts d
    WHERE
        d."startDate" <= NOW() -- 현재 시간 이후로 시작된 할인
        AND d."endDate" >= NOW() -- 현재 시간 이전으로 종료되지 않은 할인
),
user_wishlist_items AS (
    SELECT
        w."itemId" AS wishlist_item_id,
        i.id AS item_id,
        i."itemId" AS item_external_id,
        i."itemName",
        i."categoryId",
        i."lowestPrice",
        i."bestDiscountRate",
        i."is_online",
        i."online_url"
    FROM
        public.wishlists w
    JOIN
        public.items i
    ON
        w."itemId" = i.id
    WHERE
        w."userId" = user_uuid -- 사용자 UUID 매개변수로 사용
)
SELECT
    uwi.item_id,
    uwi.item_external_id,
    uwi.item_name,
    uwi.category_id,
    uwi.lowest_price,
    uwi.best_discount_rate,
    uwi.is_online,
    uwi.online_url
FROM
    user_wishlist_items uwi
JOIN
    current_discounts cd
ON
    uwi.item_external_id = cd.discount_item_id;
$$ LANGUAGE sql STABLE;