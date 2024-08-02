create extension if not exists moddatetime schema extensions;

-- assuming the table name is "todos", and a timestamp column "updated_at"
-- this trigger will set the "updated_at" column to the current timestamp for every update
create trigger handle_updated_at before update on items
  for each row execute procedure moddatetime (updated_at);