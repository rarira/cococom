drop function if exists "public"."get_discounts_with_wishlist_counts"();

drop function if exists "public"."get_discounts_with_wishlist_counts"(_current_time_stamp timestamp without time zone, _user_id uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_discounts_with_wishlist_counts(_current_time_stamp timestamp without time zone, _user_id uuid)
 RETURNS TABLE(id integer, "itemId" text, "startDate" timestamp without time zone, "endDate" timestamp without time zone, price numeric, discount numeric, "discountPrice" numeric, "discountHash" text, "discountRate" numeric, items jsonb, "totalWishlistCount" numeric, "userWishlistCount" boolean)
 LANGUAGE sql
AS $function$
  SELECT
      d.*,
      to_json(
        json_build_object(
          'id', i.id,
          'itemId', i."itemId",
          'itemName', i."itemName",
          'categoryId', i."categoryId",
          'bestDiscountRate', i."bestDiscountRate",
          'lowestPrice', i."lowestPrice",
          'categories', to_json(c),
          'discounts', (
            SELECT json_agg(to_json(d2))
            FROM discounts d2
            WHERE d2."itemId" = i."itemId"
          )
        )
      ) AS items,
      (
        SELECT COUNT(*)
        FROM wishlists w
        WHERE w."itemId" = i.id
      ) AS "totalWishlistCount",
      CASE 
        WHEN _user_id IS NOT NULL THEN
            (SELECT EXISTS (SELECT 1 FROM wishlists w WHERE w."itemId" = i.id AND w."userId" = _user_id))
        ELSE
            NULL
      END AS "userWishlistCount"
  FROM
      discounts d
  LEFT JOIN items i ON d."itemId" = i."itemId"
  LEFT JOIN categories c ON i."categoryId" = c.id
  WHERE
      d."startDate" <= _current_time_stamp
      AND d."endDate" >= _current_time_stamp
$function$
;

create policy "Enable read access for all users"
on "public"."wishlists"
as permissive
for select
to public
using (true);



