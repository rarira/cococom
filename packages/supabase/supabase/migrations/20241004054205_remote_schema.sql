create table "public"."items_duplicate" (
    "id" integer not null default nextval('items_id_seq'::regclass),
    "itemId" text not null,
    "itemName" text,
    "categoryId" integer,
    "lowestPrice" numeric,
    "bestDiscountRate" numeric,
    "bestDiscount" numeric,
    "created_at" timestamp with time zone default (now() AT TIME ZONE 'kst'::text),
    "updated_at" timestamp with time zone,
    "totalDiscountCount" integer default 0,
    "totalCommentCount" integer default 0,
    "totalWishlistCount" integer default 0
);


alter table "public"."items_duplicate" enable row level security;

alter table "public"."dalins" alter column "hash" drop not null;

alter table "public"."discounts" add column "is_online" boolean not null default false;

alter table "public"."histories" add column "is_online" boolean not null default false;

alter table "public"."items" add column "is_online" boolean not null default false;

-- drop sequence if exists "public"."dalin_id_seq";

CREATE UNIQUE INDEX "items_duplicate_itemId_idx" ON public.items_duplicate USING btree ("itemId");

CREATE UNIQUE INDEX "items_duplicate_itemId_key" ON public.items_duplicate USING btree ("itemId");

CREATE INDEX "items_duplicate_itemName_idx" ON public.items_duplicate USING pgroonga ("itemName");

CREATE UNIQUE INDEX items_duplicate_pkey ON public.items_duplicate USING btree (id);

alter table "public"."items_duplicate" add constraint "items_duplicate_pkey" PRIMARY KEY using index "items_duplicate_pkey";

alter table "public"."items_duplicate" add constraint "items_duplicate_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES categories(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."items_duplicate" validate constraint "items_duplicate_categoryId_fkey";

alter table "public"."items_duplicate" add constraint "items_duplicate_itemId_key" UNIQUE using index "items_duplicate_itemId_key";

grant delete on table "public"."items_duplicate" to "anon";

grant insert on table "public"."items_duplicate" to "anon";

grant references on table "public"."items_duplicate" to "anon";

grant select on table "public"."items_duplicate" to "anon";

grant trigger on table "public"."items_duplicate" to "anon";

grant truncate on table "public"."items_duplicate" to "anon";

grant update on table "public"."items_duplicate" to "anon";

grant delete on table "public"."items_duplicate" to "authenticated";

grant insert on table "public"."items_duplicate" to "authenticated";

grant references on table "public"."items_duplicate" to "authenticated";

grant select on table "public"."items_duplicate" to "authenticated";

grant trigger on table "public"."items_duplicate" to "authenticated";

grant truncate on table "public"."items_duplicate" to "authenticated";

grant update on table "public"."items_duplicate" to "authenticated";

grant delete on table "public"."items_duplicate" to "service_role";

grant insert on table "public"."items_duplicate" to "service_role";

grant references on table "public"."items_duplicate" to "service_role";

grant select on table "public"."items_duplicate" to "service_role";

grant trigger on table "public"."items_duplicate" to "service_role";

grant truncate on table "public"."items_duplicate" to "service_role";

grant update on table "public"."items_duplicate" to "service_role";


