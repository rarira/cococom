alter table "public"."categories" enable row level security;

create policy "Enable read access for all users"
on "public"."categories"
as permissive
for select
to public
using (true);



