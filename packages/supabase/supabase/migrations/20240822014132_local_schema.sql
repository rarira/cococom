drop function if exists "public"."search_items_by_itemid"(item_id text, is_on_sale boolean, user_id uuid, page integer, page_size integer);

drop function if exists "public"."search_items_by_keyword"(keyword text, is_on_sale boolean, user_id uuid, page integer, page_size integer);

alter table "public"."memos" add column "updated_at" timestamp with time zone default now();

CREATE TRIGGER handle_update_at_memos BEFORE UPDATE ON public.memos FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


