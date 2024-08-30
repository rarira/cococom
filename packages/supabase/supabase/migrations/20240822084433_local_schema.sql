create policy "Enable update for users based on user_id"
on "public"."memos"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = "userId"));



