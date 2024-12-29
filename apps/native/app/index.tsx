import { Redirect, router } from 'expo-router';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';
import { usePagerView } from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';
import { INTRO_PAGES } from '@cococom/libs/constants';

import Text from '@/components/core/text';
import { useWalkthroughStore } from '@/store/walkthrough';
import PageDotNavButton from '@/components/custom/button/nav/page-dot-nav';
import Button from '@/components/core/button';
import { useUserStore } from '@/store/user';
import FirstIntroPagerView from '@/components/custom/view/pager/intro/first';
import { IntroPageProps } from '@/libs/type';
import SecondIntroPagerView from '@/components/custom/view/pager/intro/second';
import StatusBar from '@/components/custom/status-bar';
import ThirdIntroPagerView from '@/components/custom/view/pager/intro/third';
import FourthIntroPagerView from '@/components/custom/view/pager/intro/fourth';

const intro_pages: {
  title: string;
  subtitle?: string;
  component: (props: IntroPageProps) => JSX.Element;
}[] = [
  {
    component: (props: IntroPageProps) => <FirstIntroPagerView {...props} />,
  },
  {
    component: (props: IntroPageProps) => <SecondIntroPagerView {...props} />,
  },
  {
    component: (props: IntroPageProps) => <ThirdIntroPagerView {...props} />,
  },
  {
    component: (props: IntroPageProps) => <FourthIntroPagerView {...props} />,
  },
].map((page, index) => ({ ...page, ...INTRO_PAGES[index] }));

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
    <>
      <StatusBar hidden />
      <View
        style={styles.container({
          topInset: top,
          bottomInset: bottom,
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
          {intro_pages.map(({ title, subtitle, component }, index) => (
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
    </>
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
    paddingTop: theme.spacing.lg * 2,
    gap: theme.spacing.md,
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
    color: 'white',
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
    fontSize: theme.fontSize.xl,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pageSubtitleText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.tint,
    lineHeight: theme.fontSize.md * 1.4,
    textAlign: 'center',
  },
}));
