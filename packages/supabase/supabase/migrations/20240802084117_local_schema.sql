create extension if not exists "moddatetime" with schema "extensions";


CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');


