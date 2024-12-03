-- 조회
SELECT c.relname AS sequence_name
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relkind = 'S' -- 시퀀스를 의미
  AND n.nspname = 'public' -- 테이블이 속한 스키마
  AND c.relname LIKE 'histories%';


SELECT last_value FROM public.histories_id_seq;


ALTER SEQUENCE public.histories_id_seq RESTART WITH 96;
