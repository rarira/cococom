ALTER TABLE public.items
ADD COLUMN "totalDiscountCount" int DEFAULT 0;

ALTER TABLE public.items
ADD COLUMN "totalCommentCount" int DEFAULT 0;

ALTER TABLE public.items
ADD COLUMN "totalWishlistCount" int DEFAULT 0;

UPDATE public.items i
SET "totalDiscountCount" = subquery.discount_count
FROM (
    SELECT 
        d."itemId", 
        COUNT(*) AS discount_count
    FROM 
        public.discounts d
    GROUP BY 
        d."itemId"
) AS subquery
WHERE i."itemId" = subquery."itemId";

UPDATE public.items i
SET "totalCommentCount" = subquery.comment_count
FROM (
    SELECT 
        c."item_id", 
        COUNT(*) AS comment_count
    FROM 
        public.comments c
    GROUP BY 
        c."item_id"
) AS subquery
WHERE i.id = subquery."item_id";

UPDATE public.items i
SET "totalWishlistCount" = subquery.wishlist_count
FROM (
    SELECT 
        w."itemId", 
        COUNT(*) AS wishlist_count
    FROM 
        public.wishlists w
    GROUP BY 
        w."itemId"
) AS subquery
WHERE i.id = subquery."itemId";
