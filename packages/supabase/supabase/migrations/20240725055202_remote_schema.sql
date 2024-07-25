alter table "public"."discounts" add column "created_at" timestamp with time zone default (now() AT TIME ZONE 'kst'::text);

alter table "public"."items" add column "created_at" timestamp with time zone default (now() AT TIME ZONE 'kst'::text);

alter table "public"."profiles" add column "created_at" timestamp with time zone default (now() AT TIME ZONE 'kst'::text);


