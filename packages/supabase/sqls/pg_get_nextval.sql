CREATE OR REPLACE FUNCTION pg_get_nextval(sequence_name text)
RETURNS bigint AS $$
BEGIN
  RETURN nextval(sequence_name);
END;
$$ LANGUAGE plpgsql;