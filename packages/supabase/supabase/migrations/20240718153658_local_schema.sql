set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_discounts_with_wishlist_counts(_current_time_stamp timestamp without time zone, _user_id uuid, _category_sector "CategorySectors")
 RETURNS TABLE(id integer, "startDate" timestamp without time zone, "endDate" timestamp without time zone, price numeric, "discountPrice" numeric, "discountRate" numeric, items jsonb)
 LANGUAGE sql
AS $function$
  SELECT
      d.id,
      d."startDate",
        d."endDate",
        d.price,
        d."discountPrice",
        d."discountRate",
      get_items_with_wishlist_counts(d."itemId", _user_id, false) AS items
  FROM
      discounts d
  LEFT JOIN items i ON d."itemId" = i."itemId"
  LEFT JOIN categories c ON i."categoryId" = c.id
  WHERE
      d."startDate" <= _current_time_stamp
      AND d."endDate" >= _current_time_stamp
      AND c."categorySector" = _category_sector;
$function$
;


