CREATE OR REPLACE FUNCTION max_wishlist_limit(user_id uuid)
RETURNS integer AS $$
DECLARE
  user_subscription_level TEXT;
  max_limit INTEGER;
BEGIN
  -- 프로필 테이블에서 구독 레벨 확인
  SELECT p.subscription_level INTO user_subscription_level
  FROM profiles p
  WHERE p.id = user_id;

  -- subscription_limits 테이블에서 제한 가져오기
  SELECT max_wishlist_limit INTO max_limit
  FROM subscription_limits
  WHERE subscription_level = user_subscription_level;

  -- 값 반환
  RETURN COALESCE(max_limit, 50); -- 기본값 설정
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