create table "public"."profiles" (
    "id" uuid not null,
    "nickname" text
);


alter table "public"."profiles" enable row level security;

create table "public"."wishlists" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "itemId" integer,
    "userId" uuid
);


alter table "public"."wishlists" enable row level security;

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX wishlists_pkey ON public.wishlists USING btree (id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."wishlists" add constraint "wishlists_pkey" PRIMARY KEY using index "wishlists_pkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."wishlists" add constraint "public_wishlists_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES items(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."wishlists" validate constraint "public_wishlists_itemId_fkey";

alter table "public"."wishlists" add constraint "public_wishlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."wishlists" validate constraint "public_wishlists_userId_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_discounts_with_wishlist_counts()
 RETURNS TABLE(id integer, "itemId" text, "startDate" timestamp without time zone, "endDate" timestamp without time zone, price numeric, discount numeric, "discountPrice" numeric, "discountHash" text, "discountRate" numeric, items json, "totalWishlistCount" numeric, "userWishlistCount" numeric)
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
      (
        SELECT COUNT(*)
        FROM wishlists w
        WHERE w."itemId" = i.id AND w."userId" = 'cacbfc7b-d1ba-4d64-a654-32d75723d50e'
      ) AS "userWishlistCount"
  FROM
      discounts d
  LEFT JOIN items i ON d."itemId" = i."itemId"
  LEFT JOIN categories c ON i."categoryId" = c.id
  WHERE
      d."startDate" <= '2024-07-15'
      AND d."endDate" >= '2024-07-15'
$function$
;

CREATE OR REPLACE FUNCTION public.get_discounts_with_wishlist_counts(_current_time_stamp timestamp without time zone, _user_id uuid)
 RETURNS TABLE(id integer, "itemId" text, "startDate" timestamp without time zone, "endDate" timestamp without time zone, price numeric, discount numeric, "discountPrice" numeric, "discountHash" text, "discountRate" numeric, items jsonb, "totalWishlistCount" numeric, "userWishlistCount" numeric)
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
            (SELECT COUNT(*) FROM wishlists w WHERE w."itemId" = i.id AND w."userId" = _user_id)
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

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, nickname)
  values (new.id, new.raw_user_meta_data ->> 'nickname');
  return new;
end;
$function$
;

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."wishlists" to "anon";

grant insert on table "public"."wishlists" to "anon";

grant references on table "public"."wishlists" to "anon";

grant select on table "public"."wishlists" to "anon";

grant trigger on table "public"."wishlists" to "anon";

grant truncate on table "public"."wishlists" to "anon";

grant update on table "public"."wishlists" to "anon";

grant delete on table "public"."wishlists" to "authenticated";

grant insert on table "public"."wishlists" to "authenticated";

grant references on table "public"."wishlists" to "authenticated";

grant select on table "public"."wishlists" to "authenticated";

grant trigger on table "public"."wishlists" to "authenticated";

grant truncate on table "public"."wishlists" to "authenticated";

grant update on table "public"."wishlists" to "authenticated";

grant delete on table "public"."wishlists" to "service_role";

grant insert on table "public"."wishlists" to "service_role";

grant references on table "public"."wishlists" to "service_role";

grant select on table "public"."wishlists" to "service_role";

grant trigger on table "public"."wishlists" to "service_role";

grant truncate on table "public"."wishlists" to "service_role";

grant update on table "public"."wishlists" to "service_role";


