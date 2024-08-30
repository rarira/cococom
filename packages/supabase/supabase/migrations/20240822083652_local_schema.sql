create policy "Enable delete for users based on user_id"
on "public"."memos"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = "userId"));



