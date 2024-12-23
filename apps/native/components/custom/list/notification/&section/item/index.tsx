import { Link } from 'expo-router';
import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useTodaysNotifications } from '@/hooks/notification/useTodaysNotifications';
import Text from '@/components/core/text';

interface NotificationsSectionListItemProps {
  item: ReturnType<typeof useTodaysNotifications>['sectionedNotifications'][number]['data'][number];
}

const NotificationsSectionListItem = memo(function NotificationsSectionListItem({
  item,
}: NotificationsSectionListItemProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Link href={`/(main)/(tabs)/(home)/item?itemId=${item.id}&isModal=true`} asChild>
      <Pressable style={styles.container}>
        {item.unread && <View style={styles.unreadDot} />}
        <Text style={styles.itemChannelText}>{`[${item.is_online ? '온라인' : '오프라인'}]`}</Text>
        <Text style={styles.itemNameText} numberOfLines={1} ellipsizeMode="tail">
          {item.itemName}
        </Text>
      </Pressable>
    </Link>
  );
});

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  itemChannelText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.tint3,
  },
  itemNameText: {
    fontSize: theme.fontSize.normal,
  },
  unreadDot: {
    width: theme.spacing.sm,
    height: theme.spacing.sm,
    borderRadius: theme.spacing.sm / 2,
    backgroundColor: theme.colors.alert,
  },
}));

export default NotificationsSectionListItem;
