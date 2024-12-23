import { memo, useCallback, useMemo } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { View } from 'react-native';

import Button from '@/components/core/button';
import Text from '@/components/core/text';
import { useTodaysNotifications } from '@/hooks/notification/useTodaysNotifications';
import { convertSimpleIsoStringToKoreanDate } from '@/libs/date';

interface NotificationSectionHeaderProps {
  section: ReturnType<typeof useTodaysNotifications>['sectionedNotifications'][number];
  setCurrentSection: React.Dispatch<
    React.SetStateAction<
      ReturnType<typeof useTodaysNotifications>['sectionedNotifications'][number]['title'] | null
    >
  >;
  currentSection:
    | ReturnType<typeof useTodaysNotifications>['sectionedNotifications'][number]['title']
    | null;
}

const NotificationSectionHeader = memo(function NotificationSectionHeader({
  section,
  currentSection,
  setCurrentSection,
}: NotificationSectionHeaderProps) {
  const { styles } = useStyles(stylesheet);

  const handleSectionHeaderPress = useCallback(
    (title: (typeof section)['title']) => {
      if (title === currentSection) {
        setCurrentSection(null);
      } else {
        setCurrentSection(title);
      }
    },
    [currentSection, setCurrentSection],
  );

  const hasUnreadData = useMemo(() => section.data.some(item => item.unread), [section.data]);

  const isExpanded = currentSection === section.title;

  return (
    <Button
      onPress={() => handleSectionHeaderPress(section.title)}
      style={styles.sectionHeaderContainer(isExpanded)}
      hitSlop={0}
    >
      {hasUnreadData && <View style={styles.unreadDot} />}
      <Text style={styles.sectionHeaderDate}>
        {convertSimpleIsoStringToKoreanDate(section.title)}
      </Text>
      <Text style={styles.sectionHeaderText}>할인 개시된 관심상품</Text>
    </Button>
  );
});

const stylesheet = createStyleSheet(theme => ({
  sectionHeaderContainer: (isExpanded: boolean) => ({
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: 0,
    borderBottomWidth: isExpanded ? 0 : 1,
    borderColor: theme.colors.lightShadow,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  }),
  sectionHeaderDate: {
    fontSize: theme.fontSize.normal,
    fontWeight: 'semibold',
  },
  sectionHeaderText: {
    fontSize: theme.fontSize.xs,
  },
  unreadDot: {
    width: theme.spacing.md,
    height: theme.spacing.md,
    borderRadius: theme.spacing.md / 2,
    backgroundColor: theme.colors.alert,
  },
}));

export default NotificationSectionHeader;
