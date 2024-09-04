set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.decrement_total_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- 해당 itemId에 대한 totalCommentCount를 1 감소시킵니다.
    UPDATE items
    SET "totalCommentCount" = "totalCommentCount" - 1
    WHERE id = OLD.item_id;

    RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.decrement_total_wishlist_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- 해당 itemId에 대한 totalCommentCount를 1 감소시킵니다.
    UPDATE items
    SET "totalWishlistCount" = "totalWishlistCount" - 1
    WHERE id = OLD."itemId";    

    RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_total_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- 해당 itemId에 대한 totalDiscountCount를 1 증가시킵니다.
    UPDATE items
    SET "totalCommentCount" = "totalCommentCount" + 1
    WHERE id = NEW.item_id;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_total_discount_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- 해당 itemId에 대한 totalDiscountCount를 1 증가시킵니다.
    UPDATE items
    SET "totalDiscountCount" = "totalDiscountCount" + 1
    WHERE "itemId" = NEW."itemId";

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_total_wishlist_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- 해당 itemId에 대한 totalDiscountCount를 1 증가시킵니다.
    UPDATE items
    SET "totalWishlistCount" = "totalWishlistCount" + 1
    WHERE id = NEW."itemId";

    RETURN NEW;
END;
$function$
;


