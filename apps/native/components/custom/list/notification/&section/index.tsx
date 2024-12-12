import { memo, useEffect, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { SectionList, View } from 'react-native';

import { useTodaysNotifications } from '@/hooks/notification/useTodaysNotifications';

import NotificationSectionHeader from './header';
import NotificationsSectionListSection from './section';

type NotificationSectionListProps = {
  data: ReturnType<typeof useTodaysNotifications>['sectionedNotifications'];
};

const NotificationSectionList = memo(function NotificationSectionList({
  data,
}: NotificationSectionListProps) {
  const { styles } = useStyles(stylesheet);

  const [currentSection, setCurrentSection] = useState<(typeof data)[number]['title'] | null>(
    data[0].title,
  );

  useEffect(() => {
    setCurrentSection(data[0].title);
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
    />
  );
});

const stylesheet = createStyleSheet(theme => ({
  separator: {
    height: theme.spacing.sm,
  },
}));

export default NotificationSectionList;
