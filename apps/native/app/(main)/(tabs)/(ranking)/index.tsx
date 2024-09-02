import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Route, SceneMap, TabBar, TabBarItem, TabView, TabViewProps } from 'react-native-tab-view';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import RankingSortBottomSheet from '@/components/custom/bottom-sheet/ranking-sort';
import ScreenTitleText from '@/components/custom/text/screen-title';
import Chip from '@/components/ui/chip';
import Text from '@/components/ui/text';
import { useDiscountsSort } from '@/hooks/useDiscountsSort';

const FirstRoute = () => (
  <ScrollView style={{ flex: 1 }}>
    <Text>
      he standard Lorem Ipsum passage, used since the 1500s "Lorem ipsum dolor sit amet, consectetur
      adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
      fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
      officia deserunt mollit anim id est laborum." Section 1.10.32 of "de Finibus Bonorum et
      Malorum", written by Cicero in 45 BC "Sed ut perspiciatis unde omnis iste natus error sit
      voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
      inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
      voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
      dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
      quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
      incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
      nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
      consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil
      molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?" 1914
      translation by H. Rackham "But I must explain to you how all this mistaken idea of denouncing
      pleasure and praising pain was born and I will give you a complete account of the system, and
      expound the actual teachings of the great explorer of the truth, the master-builder of human
      happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but
      because those who do not know how to pursue pleasure rationally encounter consequences that
      are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain
      pain of itself, because it is pain, but because occasionally circumstances occur in which toil
      and pain can procure him some great pleasure. To take a trivial example, which of us ever
      undertakes laborious physical exercise, except to obtain some advantage from it? But who has
      any right to find fault with a man who chooses to enjoy a pleasure that has no annoying
      consequences, or one who avoids a pain that produces no resultant pleasure?" Section 1.10.33
      of "de Finibus Bonorum et Malorum", written by Cicero in 45 BC "At vero eos et accusamus et
      iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
      quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique
      sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum
      quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est
      eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis
      voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis
      debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae
      non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis
      voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat." 1914
      translation by H. Rackham "On the other hand, we denounce with righteous indignation and
      dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so
      blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and
      equal blame belongs to those who fail in their duty through weakness of will, which is the
      same as saying through shrinking from toil and pain. These cases are perfectly simple and easy
      to distinguish. In a free hour, when our power of choice is untrammelled and when nothing
      prevents our being able to do what we like best, every pleasure is to be welcomed and every
      pain avoided. But in certain circumstances and owing to the claims of duty or the obligations
      of business it will frequently occur that pleasures have to be repudiated and annoyances
      accepted. The wise man therefore always holds in these matters to this principle of selection:
      he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid
      worse pains."
    </Text>
  </ScrollView>
);

const SecondRoute = () => <View style={{ flex: 1 }} />;

const renderScene = SceneMap({
  discounted: FirstRoute,
  all: SecondRoute,
});

export default function RankingScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { styles, theme } = useStyles(stylesheet);

  const { top } = useSafeAreaInsets();

  const { sort, handleSortChange } = useDiscountsSort(_sort =>
    bottomSheetModalRef.current?.dismiss(),
  );

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'discounted', title: '세일 상품' },
    { key: 'all', title: '모든 상품' },
  ]);

  const renderTabBar = useCallback<NonNullable<TabViewProps<Route>['renderTabBar']>>(
    props => {
      console.log('renderTabBar', props);
      return (
        <TabBar
          {...props}
          indicatorContainerStyle={styles.tabBarIndicatorContainer}
          renderLabel={({ route, focused }) => (
            <Chip
              text={route.title!}
              style={styles.tabBarLabelContainer(focused)}
              textProps={{ style: styles.tabBarLabelText(focused) }}
            />
          )}
          renderTabBarItem={props => <TabBarItem {...props} style={styles.tabBarItem} />} // scrollEnabled
          style={styles.tabBarContainer}
          // tabStyle={styles.tabContainer}
          pressOpacity={0.5}
          bounces
          // gap={theme.spacing.md}
          // NOTE: TabBar 컴포넌트 버그 이렇게 하거나 scrollToOffset을 requestAnimationFrame적용 필요
          // contentContainerStyle={styles.tabBarContentContainer}
        />
      );
    },
    [styles],
  );

  return (
    <View style={styles.container(top)}>
      <ScreenTitleText>현재 세일 중인 상품을 다양한 랭킹으로 만나보세요</ScreenTitleText>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        // initialLayout={{ width: '100% }}
      />
      <RankingSortBottomSheet
        ref={bottomSheetModalRef}
        currentSort={sort}
        onSortChange={handleSortChange}
      />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: (topInset: number) => ({
    flex: 1,
    paddingTop: topInset + theme.spacing.lg,
    paddingHorizontal: theme.screenHorizontalPadding,
    backgroundColor: theme.colors.background,
  }),
  tabBarContainer: {
    backgroundColor: theme.colors.modalBackground,
    borderRadius: theme.borderRadius.lg,
  },
  tabBarItem: {
    alignItems: undefined,
    height: '100%',
    padding: theme.spacing.md,
  },
  tabBarIndicatorContainer: {
    display: 'none',
  },
  tabBarLabelContainer: (focused: boolean) => ({
    backgroundColor: focused ? theme.colors.typography : 'transparent',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: focused ? theme.colors.typography : 'transparent',
    borderRadius: theme.borderRadius.md,
    opacity: focused ? 1 : 0.5,
  }),
  tabBarLabelText: (focused: boolean) => ({
    color: focused ? theme.colors.background : theme.colors.typography,
    fontWeight: focused ? 'bold' : 'normal',
    fontSize: theme.fontSize.normal,
    lineHeight: theme.fontSize.md * 1.5,
  }),
}));
