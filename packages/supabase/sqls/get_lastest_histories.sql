DROP FUNCTION IF EXISTS get_latest_histories();

create or replace function get_latest_histories()
returns table (
    id bigint,
    created_at timestamp with time zone,
    is_online boolean,
    total_discounts_count bigint
) as $$
declare
    _current_time_stamp timestamp with time zone := now();
begin
    return query
    (
        -- 최신의 is_online = false 레코드
        select h.id, h.created_at, h.is_online,
        (
            select count(*)
            from public.discounts d
            where 
                d."startDate" <= _current_time_stamp
                and d."endDate" >= _current_time_stamp
                and d.is_online = false
        ) as total_discounts_count
        from public.histories h
        where h.is_online = false
        order by h.created_at desc
        limit 1
    );
    return query
    (
        -- 최신의 is_online = true 레코드
        select h.id, h.created_at, h.is_online,
        (
            select count(*)
            from public.discounts d
            where 
                d."startDate" <= _current_time_stamp
                and d."endDate" >= _current_time_stamp
                and d.is_online = true
        ) as total_discounts_count
        from public.histories h
        where h.is_online = true
        order by h.created_at desc
        limit 1
    );
end;
$$ language plpgsql;
