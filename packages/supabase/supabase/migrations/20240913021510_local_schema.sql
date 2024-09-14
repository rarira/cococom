alter table "public"."dalins" add column "hash" text not null;

alter table "public"."dalins" alter column "product_id" set not null;

CREATE UNIQUE INDEX dalins_hash_key ON public.dalins USING btree (hash);

alter table "public"."dalins" add constraint "dalins_hash_key" UNIQUE using index "dalins_hash_key";


