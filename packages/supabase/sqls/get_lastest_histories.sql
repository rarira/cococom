create or replace function get_latest_histories()
returns table (
    id bigint,
    created_at timestamp with time zone,
    new_item_count integer,
    added_discount_count integer,
    is_online boolean
) as $$
begin
    return query
    (
        -- 최신의 is_online = false 레코드
        select h.id, h.created_at, h.new_item_count, h.added_discount_count, h.is_online
        from public.histories h
        where h.is_online = false
        order by h.created_at desc
        limit 1
    );
    return query
    (
        -- 최신의 is_online = true 레코드
        select h.id, h.created_at, h.new_item_count, h.added_discount_count, h.is_online
        from public.histories h
        where h.is_online = true
        order by h.created_at desc
        limit 1
    );
end;
$$ language plpgsql;
