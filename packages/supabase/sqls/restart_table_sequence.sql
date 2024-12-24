CREATE OR REPLACE FUNCTION restart_table_sequence(table_name TEXT, new_value BIGINT)
RETURNS VOID AS $$
DECLARE
    sequence_name TEXT;
BEGIN
    -- SEQUENCE 이름 동적으로 생성
    sequence_name := format('%I_id_seq', table_name); -- 테이블명_id_seq 형태로 가정
    
    -- 동적 SQL로 ALTER SEQUENCE 실행
    EXECUTE format('ALTER SEQUENCE %s RESTART WITH %s;', sequence_name, new_value);
END;
$$ LANGUAGE plpgsql;