create policy "Enable delete for users based on user_id"
on "public"."wishlists"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = "userId"));


create policy "Enable insert for authenticated users only"
on "public"."wishlists"
as permissive
for insert
to authenticated
with check (true);



