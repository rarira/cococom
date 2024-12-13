import React, { memo, useEffect } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useSharedValue } from 'react-native-reanimated';
import { FlatList } from 'react-native';

import AccordionItem from '@/components/core/accordion/item';
import { useTodaysNotifications } from '@/hooks/notification/useTodaysNotifications';

import NotificationsSectionListItem from '../item';

interface NotificationsSectionListSectionProps {
  currentSection:
    | ReturnType<typeof useTodaysNotifications>['sectionedNotifications'][number]['title']
    | null;
  section: ReturnType<typeof useTodaysNotifications>['sectionedNotifications'][number];
}

const NotificationsSectionListSection = memo(function NotificationsSectionListSection({
  currentSection,
  section,
}: NotificationsSectionListSectionProps) {
  const { styles } = useStyles(stylesheet);
  const isExpanded = useSharedValue(currentSection === section.title);

  useEffect(() => {
    isExpanded.value = currentSection === section.title;
  }, [currentSection, isExpanded, section]);

  return (
    <AccordionItem isExpanded={isExpanded} viewKey={section.title} style={styles.container}>
      <FlatList
        data={section.data}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) => <NotificationsSectionListItem item={item} />}
        style={styles.flatList}
      />
    </AccordionItem>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: theme.spacing.md,
    borderColor: theme.colors.lightShadow,
    borderBottomWidth: 1,
  },
  flatList: {
    width: '100%',
    paddingBottom: theme.spacing.md,
  },
}));

export default NotificationsSectionListSection;
