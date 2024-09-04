drop function if exists "public"."get_alltime_top_items"(_user_id uuid, _order_by_column text, _order_by_direction text, _limit_count integer);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.decrement_total_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
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
AS $function$
BEGIN
    -- 해당 itemId에 대한 totalCommentCount를 1 감소시킵니다.
    UPDATE items
    SET "totalWishlistCount" = "totalWishlistCount" - 1
    WHERE id = OLD.item_id;

    RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_total_comment_count()
 RETURNS trigger
 LANGUAGE plpgsql
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

CREATE OR REPLACE FUNCTION public.get_alltime_top_items(_user_id uuid, _order_by_column text DEFAULT 'created_at'::text, _order_by_direction text DEFAULT 'DESC'::text, _limit_count integer DEFAULT 50)
 RETURNS TABLE(id integer, "itemName" text, "itemId" text, created_at timestamp with time zone, updated_at timestamp with time zone, "bestDiscountRate" numeric, "lowestPrice" numeric, "bestDiscount" numeric, "totalWishlistCount" integer, "totalCommentCount" integer, "totalDiscountCount" integer, "totalMemoCount" bigint, "isWishlistedByUser" boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY EXECUTE FORMAT(
        'WITH item_counts AS (
            SELECT
                i.id,
                i."itemName",
                i."itemId",
                i.created_at,
                i.updated_at,
                i."bestDiscountRate",
                i."lowestPrice",
                i."bestDiscount",
                i."totalWishlistCount",
                i."totalCommentCount",
                i."totalDiscountCount",
                (
                    CASE
                        WHEN $1 IS NOT NULL THEN
                            (SELECT COUNT(*) FROM memos m WHERE m."itemId" = i.id AND m."userId" = $1)
                        ELSE
                            0
                    END
                ) as "totalMemoCount",
                (
                    CASE
                        WHEN $1 IS NOT NULL THEN
                            (SELECT EXISTS (SELECT 1 FROM wishlists w WHERE w."itemId" = i.id AND w."userId" = $1))
                        ELSE
                            FALSE
                    END
                ) as "isWishlistedByUser"
            FROM
                items i
        )
        SELECT * FROM item_counts
        ORDER BY %I %s
        LIMIT %L',
        _order_by_column,
        _order_by_direction,
        _limit_count
    ) USING _user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_items_with_wishlist_counts(item_id text, user_id uuid, need_discounts boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
  item jsonb;
BEGIN
  SELECT to_json(json_build_object(
    'id', i.id,
    'itemId', i."itemId",
    'itemName', i."itemName",
    'categoryId', i."categoryId",
    'bestDiscountRate', i."bestDiscountRate",
    'lowestPrice', i."lowestPrice",
    'categories', c,
    'totalDiscountCount', i."totalDiscountCount",
    'totalWishlistCount', i."totalWishlistCount",
    'totalCommentCount', i."totalCommentCount",
    -- 'discounts', (
    --   CASE
    --     WHEN need_discounts THEN
    --       (SELECT json_agg(d2)
    --       FROM discounts d2
    --       WHERE d2."itemId" = i."itemId")
    --     ELSE
    --       NULL
    --   END
    -- ),

    'totalMemoCount', (
      CASE
        WHEN user_id IS NOT NULL THEN
          (SELECT COUNT(*) FROM memos m WHERE m."itemId" = i.id AND m."userId" = user_id)
        ELSE
          NULL
      END
    ),
    'isWishlistedByUser', (
      CASE
        WHEN user_id IS NOT NULL THEN
          (SELECT EXISTS (SELECT 1 FROM wishlists w WHERE w."itemId" = i.id AND w."userId" = user_id))
        ELSE
          NULL
      END
    )
  ))
  INTO item
  FROM items i
  LEFT JOIN categories c ON i."categoryId" = c.id
  WHERE i."itemId" = item_id;
  
  RETURN item;
END;
$function$
;

CREATE TRIGGER comment_delete_trigger AFTER DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION decrement_total_comment_count();

CREATE TRIGGER comment_insert_trigger AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION increment_total_comment_count();

CREATE TRIGGER discount_insert_trigger AFTER INSERT ON public.discounts FOR EACH ROW EXECUTE FUNCTION increment_total_discount_count();

CREATE TRIGGER wishlist_delete_trigger AFTER DELETE ON public.wishlists FOR EACH ROW EXECUTE FUNCTION decrement_total_wishlist_count();

CREATE TRIGGER wishlist_insert_trigger AFTER INSERT ON public.wishlists FOR EACH ROW EXECUTE FUNCTION increment_total_wishlist_count();


