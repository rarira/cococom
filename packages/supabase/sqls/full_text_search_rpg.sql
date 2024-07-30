CREATE OR REPLACE FUNCTION search_items_by_keyword(keyword text)
RETURNS SETOF items
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM items WHERE "itemName" &@~ keyword;
END;
$$;