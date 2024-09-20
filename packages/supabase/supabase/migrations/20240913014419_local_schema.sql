create sequence "public"."dalin_id_seq";

drop policy "Enable update for users based on email" on "public"."dalins";

create policy "Enable update for anon"
on "public"."dalins"
as permissive
for update
to anon
with check (true);



