create type "public"."CategorySectors" as enum ('홈 데코', '생활용품', '디지털/가전', '기타', '건강/미용', '의류/잡화', '자동차/취미', '신선식품', '주류/음료', '즉석식품/간식', '식자재', '냉장/냉동/가공식품', '문구/사무/아동/반려');

drop function if exists "public"."get_discounts_with_wishlist_counts"(_current_time_stamp timestamp without time zone, _user_id uuid);

alter table "public"."categories" add column "categorySector" "CategorySectors" not null default '기타'::"CategorySectors";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_discounts_with_wishlist_counts(_current_time_stamp timestamp without time zone, _user_id uuid)
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
  WHERE
      d."startDate" <= _current_time_stamp
      AND d."endDate" >= _current_time_stamp;
$function$
;


