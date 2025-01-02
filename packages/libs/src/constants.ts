export const INTRO_PAGES: {
  title: string;
  subtitle?: string;
}[] = [
  {
    title: '온라인 할인은 주말 제외 매일,\n오프라인은 주2회 업데이트합니다',
    subtitle: '알림 수신을 꼭 허용해 주세요',
  },
  {
    title: '온라인/오프라인 상품을\n동시에 검색할 수 있습니다',
    // subtitle: '토글 버튼을 이용하세요',
  },
  {
    title: '별표 버튼으로 관심상품을 등록하고\n관심상품 할인 개시 알림을 받으세요',
  },
  {
    title:
      '댓글과 메모 기능을 활용하여\n다른 사용자들과 정보를 공유하고\n보다 스마트한 쇼핑을 즐기세요',
  },
] as const;

export const SECOND_INTRO_PAGES_TEXT = {
  1: {
    text: '상품 목록에서 모두 버튼\n온라인/오프라인 상품 모두 표시',
  },
  2: {
    text: '상품 목록에서 오프 버튼\n오프라인 상품만 표시',
  },
  3: {
    text: '마이 탭 > 설정 메뉴에서\n토글 순서 변경 가능',
  },
} as const;

export const THIRD_INTRO_PAGES_TEXT = {
  1: { text: '검색 탭내 별표 버튼 예' },
  2: { text: '마이 탭 > 관심상품' },
  3: { text: '홈 탭 > 알림센터' },
} as const;

export const FOURTH_INTRO_PAGES_TEXT = {
  1: { text: '상품 화면 내 댓글 탭' },
  2: { text: '상품 화면 내 메모 탭' },
  3: { text: '마이 탭 화면, 꾸욱 눌러 삭제 가능' },
} as const;
