SELECT 
    n.nspname AS schema_name,
    c.relname AS table_name,
    t.tgname AS trigger_name,
    p.proname AS function_name,
    CASE 
        WHEN (t.tgtype::integer & 1) = 1 THEN 'AFTER'
        WHEN (t.tgtype::integer & 69) = 69 THEN 'INSTEAD OF'
        ELSE 'BEFORE'
    END AS trigger_type,
    ARRAY[
        CASE WHEN (t.tgtype::integer & 2) = 2 THEN 'INSERT' END,
        CASE WHEN (t.tgtype::integer & 4) = 4 THEN 'DELETE' END,
        CASE WHEN (t.tgtype::integer & 8) = 8 THEN 'UPDATE' END,
        CASE WHEN (t.tgtype::integer & 16) = 16 THEN 'TRUNCATE' END
    ] AS trigger_events,
    pg_get_triggerdef(t.oid) AS trigger_definition
FROM 
    pg_trigger t
JOIN 
    pg_class c ON c.oid = t.tgrelid
JOIN 
    pg_namespace n ON n.oid = c.relnamespace
JOIN 
    pg_proc p ON p.oid = t.tgfoid
WHERE 
    NOT t.tgisinternal
ORDER BY 
    schema_name, table_name, trigger_name;
