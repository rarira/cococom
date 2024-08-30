alter table "public"."items" enable row level security;

alter table "public"."memos" alter column "content" set default ''::text;

CREATE UNIQUE INDEX histories_pkey ON public.histories USING btree (id);

alter table "public"."histories" add constraint "histories_pkey" PRIMARY KEY using index "histories_pkey";

create policy "Enable insert for authenticated users only"
on "public"."items"
as permissive
for insert
to anon
with check (true);


create policy "Enable read access for all users"
on "public"."items"
as permissive
for select
to public
using (true);


create policy "Enable update for anon"
on "public"."items"
as permissive
for update
to anon
using (true);



