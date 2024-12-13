import { memo, useEffect, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SectionList, View } from 'react-native';

import { useTodaysNotifications } from '@/hooks/notification/useTodaysNotifications';

import NotificationSectionHeader from './header';
import NotificationsSectionListSection from './section';
import EmptyList from '../../empty';

type NotificationSectionListProps = {
  data: ReturnType<typeof useTodaysNotifications>['sectionedNotifications'];
};

const NotificationSectionList = memo(function NotificationSectionList({
  data,
}: NotificationSectionListProps) {
  const { styles } = useStyles(stylesheet);

  const [currentSection, setCurrentSection] = useState<(typeof data)[number]['title'] | null>(
    data[0]?.title ?? null,
  );

  useEffect(() => {
    setCurrentSection(data[0]?.title ?? null);
  }, [data]);

  return (
    <SectionList
      sections={data}
      keyExtractor={item => `sectioned_item_${item.id}`}
      renderItem={({ section, index }) => {
        if (index !== 0) return null;
        return (
          <NotificationsSectionListSection currentSection={currentSection} section={section} />
        );
      }}
      renderSectionHeader={({ section }) => (
        <NotificationSectionHeader
          section={section}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
        />
      )}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={() => (
        <EmptyList text={'할인 개시 알림이 없습니다'} style={styles.emptyList} />
      )}
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  separator: {
    height: theme.spacing.sm,
  },
  emptyList: {
    paddingTop: theme.spacing.xl * 3,
  },
}));

export default NotificationSectionList;
