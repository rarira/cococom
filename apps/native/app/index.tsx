import { Redirect, router } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';
import { usePagerView } from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

import Text from '@/components/core/text';
import { useWalkthroughStore } from '@/store/walkthrough';
import PageDotNavButton from '@/components/custom/button/nav/page-dot-nav';
import Button from '@/components/core/button';
import { useUserStore } from '@/store/user';

const PAGES_AMOUNT = 4;

export default function IntroScreen() {
  const { styles } = useStyles(stylesheet);
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
  } = usePagerView({ pagesAmount: PAGES_AMOUNT });

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
    <View style={styles.container(top, bottom)}>
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
        <View key="1" style={styles.pageContainer}>
          <Text>
            온라인 할인 정보는 매일 , 오프라인은 매주 2회 업데이트합니다. 알림 수신을 꼭 허용하세요
          </Text>
        </View>
        <View key="2" style={styles.pageContainer}>
          <Text>온라인/오프라인/모든 상품을 동시에 검색할 수 있습니다. 토글 버튼을 이용하세요</Text>
        </View>
        <View key="3" style={styles.pageContainer}>
          <Text>관심상품으로 등록하고 관심상품 할인 개시시 알림을 받으세요</Text>
        </View>
        <View key="4" style={styles.pageContainer}>
          <Text>댓글과 메모 기능을 활용하여 정보를 공유하고 보다 스마트한 쇼핑을 즐기세요</Text>
        </View>
      </AnimatedPagerView>
      <View style={styles.navGuideContainer}>
        {activePage === PAGES_AMOUNT - 1 ? (
          <Button onPress={handlePressStart} style={styles.navGuideButton}>
            <Text style={styles.navGuideButtonText}>시작하기</Text>
          </Button>
        ) : (
          <Text
            style={styles.navGuideText}
          >{`화면을 ${activePage === 0 ? '우측으로' : '좌우로'} 스와이프하세요`}</Text>
        )}
      </View>
      <PageDotNavButton
        numberOfPages={4}
        activePage={activePage}
        style={styles.pageNavContainer}
        onPressDot={handlePressDot}
      />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (topInset: number, bottomInset: number) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: topInset,
    paddingBottom: bottomInset,
  }),
  pagerContainer: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.screenHorizontalPadding,
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
}));
