set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_discounted_ranking_with_wishlist_counts(_current_time_stamp timestamp without time zone, _user_id uuid, _channel text, _limit integer, _order_field text, _order_direction text)
 RETURNS TABLE(id integer, "startDate" timestamp without time zone, "endDate" timestamp without time zone, price numeric, "discountPrice" numeric, "discountRate" numeric, discount numeric, is_online boolean, items jsonb)
 LANGUAGE plpgsql
AS $function$
DECLARE
    order_sql text;
    base_field text;
BEGIN
    -- Validate order direction
    IF _order_direction NOT IN ('ASC', 'DESC') THEN
        RAISE EXCEPTION 'Invalid order direction: %', _order_direction;
    END IF;

    -- Determine whether the order field refers to items (i) or discounts (d)
    IF _order_field LIKE 'items.%' THEN
        base_field := format('i."%s"', split_part(_order_field, '.', 2));  -- Extract and quote "xxxx" from "items.xxxx"
    ELSE
        base_field := format('d."%s"', _order_field);  -- Quote and use "d.yyyy" directly
    END IF;

    -- Build dynamic order clause
    order_sql := format('ORDER BY %s %s', base_field, _order_direction);

  RETURN QUERY EXECUTE
    format(
        'SELECT
            d.id,
            d."startDate",
            d."endDate",
            d.price,
            d."discountPrice",
            d."discountRate",
            d."discount",
            d.is_online,
            get_items_with_wishlist_counts(d."itemId", $1, false) AS items
        FROM
            discounts d
        LEFT JOIN items i ON d."itemId" = i."itemId"
        WHERE
            d."startDate" <= $2
            AND d."endDate" >= $2
            %s
        %s
        LIMIT $3',
        CASE
            WHEN _channel = 'online' THEN 'AND d.is_online = TRUE'
            WHEN _channel = 'offline' THEN 'AND d.is_online = FALSE'
            ELSE ''
        END,
        order_sql
    )
    USING _user_id, _current_time_stamp, _limit;
END;
$function$
;


