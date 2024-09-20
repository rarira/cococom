WITH duplicate_records AS (
    -- 중복 데이터들을 찾고, ROW_NUMBER()를 사용하여 각 그룹에서 id가 낮은 것을 남김
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY product_id, from_date, to_date, sale_price ORDER BY id ASC) AS rn
    FROM public.dalins
)
-- 중복된 데이터 중에서 id가 가장 낮은 레코드를 제외하고 삭제
DELETE FROM public.dalins
WHERE id IN (
    SELECT id FROM duplicate_records WHERE rn > 1
);
