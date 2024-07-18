CREATE OR REPLACE FUNCTION get_discounts_with_wishlist_counts(_current_time_stamp timestamp, _user_id uuid)
RETURNS TABLE(
    id int,
    "itemId" text,
    "startDate" timestamp without time zone,
    "endDate" timestamp without time zone,
    price numeric(65, 30),
    discount numeric(65, 30),
    "discountPrice" numeric(65, 30),
    "discountHash" text,
    "discountRate" numeric,
    items jsonb
)
LANGUAGE sql
AS $$
  SELECT
      d.*,
      get_items_with_wishlist_counts(d."itemId", _user_id, false) AS items
  FROM
      discounts d
  WHERE
      d."startDate" <= _current_time_stamp
      AND d."endDate" >= _current_time_stamp;
$$;
