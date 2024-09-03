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


CREATE OR REPLACE FUNCTION increment_total_discount_count()
RETURNS TRIGGER AS $$
BEGIN
    -- 해당 itemId에 대한 totalDiscountCount를 1 증가시킵니다.
    UPDATE items
    SET "totalDiscountCount" = "totalDiscountCount" + 1
    WHERE "itemId" = NEW."itemId";

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER discount_insert_trigger
AFTER INSERT ON discounts
FOR EACH ROW
EXECUTE FUNCTION increment_total_discount_count();


CREATE OR REPLACE FUNCTION increment_total_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    -- 해당 itemId에 대한 totalDiscountCount를 1 증가시킵니다.
    UPDATE items
    SET "totalCommentCount" = "totalCommentCount" + 1
    WHERE id = NEW.item_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_insert_trigger
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION increment_total_comment_count();

CREATE OR REPLACE FUNCTION increment_total_wishlist_count()
RETURNS TRIGGER AS $$
BEGIN
    -- 해당 itemId에 대한 totalDiscountCount를 1 증가시킵니다.
    UPDATE items
    SET "totalWishlistCount" = "totalWishlistCount" + 1
    WHERE id = NEW."itemId";

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wishlist_insert_trigger
AFTER INSERT ON wishlists
FOR EACH ROW
EXECUTE FUNCTION increment_total_wishlist_count();

CREATE OR REPLACE FUNCTION decrement_total_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    -- 해당 itemId에 대한 totalCommentCount를 1 감소시킵니다.
    UPDATE items
    SET "totalCommentCount" = "totalCommentCount" - 1
    WHERE id = OLD.item_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_delete_trigger
AFTER DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION decrement_total_comment_count();

CREATE OR REPLACE FUNCTION decrement_total_wishlist_count()
RETURNS TRIGGER AS $$
BEGIN
    -- 해당 itemId에 대한 totalCommentCount를 1 감소시킵니다.
    UPDATE items
    SET "totalWishlistCount" = "totalWishlistCount" - 1
    WHERE id = OLD.item_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wishlist_delete_trigger
AFTER DELETE ON wishlists
FOR EACH ROW
EXECUTE FUNCTION decrement_total_wishlist_count();
