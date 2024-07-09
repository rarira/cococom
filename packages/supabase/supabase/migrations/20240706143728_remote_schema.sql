create or replace view "public"."discount_rate_view" as  SELECT d.id,
    d."itemId",
    d."startDate",
    d."endDate",
    d.price,
    d.discount,
    d."discountPrice",
    d."discountHash",
        CASE
            WHEN (d.price <> (0)::numeric) THEN (d.discount / d.price)
            ELSE NULL::numeric
        END AS discount_rate
   FROM discounts d;



