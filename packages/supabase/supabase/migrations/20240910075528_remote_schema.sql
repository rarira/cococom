alter table "public"."dalins" enable row level security;

create policy "Enable insert for authenticated users only"
on "public"."dalins"
as permissive
for insert
to anon
with check (true);



