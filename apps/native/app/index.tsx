import { Redirect, router } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';
import { usePagerView } from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { th } from 'date-fns/locale';

import Text from '@/components/core/text';
import { useWalkthroughStore } from '@/store/walkthrough';
import PageDotNavButton from '@/components/custom/button/nav/page-dot-nav';
import Button from '@/components/core/button';
import { useUserStore } from '@/store/user';
import FirstIntroPagerView from '@/components/custom/view/pager/intro/first';
import { IntroPageProps } from '@/libs/type';

const INTRO_PAGES: {
  title: string;
  subtitle?: string;
  component: (props: IntroPageProps) => JSX.Element;
  backgroundColor?: string;
}[] = [
  {
    title: '온라인 할인 정보는 주말 제외 매일,\n오프라인은 매주 2회 업데이트합니다',
    subtitle: '알림 수신을 꼭 허용해 주세요',
    component: (props: IntroPageProps) => <FirstIntroPagerView {...props} />,
    // backgroundColor: 'tint',
  },
  {
    title: '온라인/오프라인 상품을\n동시에 검색할 수 있습니다',
    subtitle: '토글 버튼을 이용하세요\n토글 순서는 설정에서 변경할 수 있습니다',
    component: (props: IntroPageProps) => <></>,
  },
  {
    title: '하트버튼을 눌러 관심상품을 등록하고\n관심상품 할인 개시시 알림을 받으세요',
    subtitle: '관심상품 할인 알림은 홈화면에서 확인하세요',
    component: (props: IntroPageProps) => <></>,
  },
  {
    title:
      '댓글과 메모 기능을 활용하여\n다른 사용자들과 정보를 공유하고\n보다 스마트한 쇼핑을 즐기세요',
    component: (props: IntroPageProps) => <></>,
  },
];

export default function IntroScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const { top, bottom } = useSafeAreaInsets();
  const { intro, setFlags } = useWalkthroughStore(
    useShallow(state => ({ intro: state.flags.intro, setFlags: state.setFlags })),
  );

  const user = useUserStore(state => state.user);

  const {
    AnimatedPagerView,
    ref: pagerViewRef,
    activePage,
    setPage,
    ...rest
  } = usePagerView({ pagesAmount: INTRO_PAGES.length });

  const handlePressDot = useCallback(
    (page: number) => {
      setPage(page);
    },
    [setPage],
  );

  const handlePressStart = useCallback(() => {
    if (!user) {
      router.push('/auth/signup?from=intro');
      return;
    }
    router.replace('/home');
    setFlags('intro', true);
  }, [setFlags, user]);

  if (intro) {
    return <Redirect href={'/home'} />;
  }

  return (
    <View
      style={styles.container({
        topInset: top,
        bottomInset: bottom,
        backgroundColor: INTRO_PAGES[activePage].backgroundColor as keyof typeof theme.colors,
      })}
    >
      <AnimatedPagerView
        ref={pagerViewRef}
        style={styles.pagerContainer}
        initialPage={0}
        overdrag={rest.overdragEnabled}
        scrollEnabled={rest.scrollEnabled}
        onPageScroll={rest.onPageScroll}
        onPageSelected={rest.onPageSelected}
        onPageScrollStateChanged={rest.onPageScrollStateChanged}
      >
        {INTRO_PAGES.map(({ title, subtitle, component }, index) => (
          <View key={index} style={styles.pageContainer}>
            <Text style={styles.pageTitleText}>{title}</Text>
            <Text style={styles.pageSubtitleText}>{subtitle}</Text>
            {component({ pageNo: index, activePageNo: activePage })}
          </View>
        ))}
      </AnimatedPagerView>
      <PageDotNavButton
        numberOfPages={4}
        activePage={activePage}
        style={styles.pageNavContainer}
        onPressDot={handlePressDot}
      />
      <View style={styles.navGuideContainer}>
        {activePage === INTRO_PAGES.length - 1 ? (
          <Button onPress={handlePressStart} style={styles.navGuideButton}>
            <Text style={styles.navGuideButtonText}>시작하기</Text>
          </Button>
        ) : (
          <Text
            style={styles.navGuideText}
          >{`화면을 ${activePage === 0 ? '우측으로' : '좌우로'} 스와이프하세요`}</Text>
        )}
      </View>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: ({
    topInset,
    bottomInset,
    backgroundColor = 'modalBackground',
  }: {
    topInset: number;
    bottomInset: number;
    backgroundColor?: keyof typeof theme.colors;
  }) => ({
    flex: 1,
    backgroundColor: theme.colors[backgroundColor],
    paddingTop: topInset,
    paddingBottom: bottomInset,
  }),
  pagerContainer: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  pageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: theme.screenHorizontalPadding,
    paddingTop: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  navGuideContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navGuideButton: {
    backgroundColor: theme.colors.tint3,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navGuideButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.typography,
    fontWeight: 'bold',
  },
  navGuideText: {
    fontSize: theme.fontSize.sm,
    color: `${theme.colors.typography}88`,
  },
  pageNavContainer: {
    width: '100%',
    marginVertical: theme.spacing.md,
  },
  pageTitleText: {
    fontSize: theme.fontSize.lg,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pageSubtitleText: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.tint,
    lineHeight: theme.fontSize.normal * 1.4,
    textAlign: 'center',
  },
}));
