CREATE OR REPLACE FUNCTION get_wishlist_items_on_sale_start(user_uuid UUID, history_id BIGINT)
RETURNS TABLE (
    "wishlistId" UUID,
    id BIGINT,
    "itemId" TEXT,
    "itemName" TEXT,
    is_online BOOLEAN
) AS
$$
WITH current_discounts AS (
    SELECT
        d."itemId" AS discount_item_id
    FROM
        public.discounts d
    WHERE
        d.history_id = history_id
),
user_wishlist_items AS (
    SELECT
        w.id AS wishlist_id,
        i.id,
        i."itemId",
        i."itemName",
        i."is_online"
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
    uwi.wishlist_id,
    uwi.id,
    uwi."itemId",
    uwi."itemName",
    uwi.is_online
FROM
    user_wishlist_items uwi
JOIN
    current_discounts cd
ON
    uwi."itemId" = cd.discount_item_id;
$$ LANGUAGE sql STABLE;