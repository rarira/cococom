create table
  public.profiles (
    id uuid not null,
    nickname text null,
    created_at timestamp with time zone null default (now() at time zone 'kst'::text),
    email text null,
    email_verified boolean null,
    picture text null,
    constraint profiles_pkey primary key (id),
    constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete cascade
  ) tablespace pg_default;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname, email, email_verified, picture)
  values (new.id,     
    COALESCE(new.raw_user_meta_data->>'name', NULL),
    COALESCE(new.raw_user_meta_data->>'email', NULL),
    (new.raw_user_meta_data->>'email_verified')::boolean,
    COALESCE(new.raw_user_meta_data->>'picture', NULL) );
  return new;
end;
$$;


create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();