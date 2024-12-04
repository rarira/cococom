-- max_wishlist_limit 함수 정의
CREATE OR REPLACE FUNCTION max_wishlist_limit(user_id uuid)
RETURNS integer AS $$
DECLARE
  user_subscription_level text; -- 변수 이름을 명확히 변경
BEGIN
  -- 프로필 테이블에서 구독 레벨 확인
  SELECT p.subscription_level INTO user_subscription_level
  FROM profiles p
  WHERE p.id = user_id;

  -- 구독 레벨에 따라 최대 허용 수 반환
  IF user_subscription_level = 'premium' THEN
    RETURN 100;  -- 프리미엄 사용자: 최대 100개
  ELSE
    RETURN 50;   -- 기본 사용자: 최대 50개
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION can_insert_wishlist(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM wishlists w
    WHERE w."userId" = user_id
  ) < max_wishlist_limit(user_id);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION enforce_wishlist_limit()
RETURNS TRIGGER AS $$
DECLARE
  max_limit INTEGER;
BEGIN
  -- 사용자별 최대 허용 wishlist 개수를 계산
  max_limit := max_wishlist_limit(NEW."userId");

  -- 현재 wishlist 개수를 비교
  IF (
    SELECT COUNT(*) FROM wishlists WHERE "userId" = NEW."userId"
  ) >= max_limit THEN
    RAISE EXCEPTION 'You have reached the maximum wishlist limit.'
      USING 
        ERRCODE = 'P0001',
        DETAIL = max_limit,
        HINT = 'Remove an item before adding more to your wishlist.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wishlist_insert_limit_trigger
BEFORE INSERT ON wishlists
FOR EACH ROW
EXECUTE FUNCTION enforce_wishlist_limit();