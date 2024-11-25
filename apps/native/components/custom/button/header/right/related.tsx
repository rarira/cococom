import { Tables } from '@cococom/supabase/types';
import { Link } from 'expo-router';
import { memo } from 'react';
import { Pressable } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ButtonProps } from '@/components/core/button';
import Text from '@/components/core/text';

interface HeaderRightRelatedButtonProps extends ButtonProps {
  item: Pick<Tables<'items'>, 'related_item_id' | 'is_online'>;
}

const HeaderRightRelatedButton = memo(function HeaderRightRelatedButton({
  item,
}: HeaderRightRelatedButtonProps) {
  const { styles } = useStyles(stylesheet);

  return (
    <Link href={`/item?itemId=${item.related_item_id}`} asChild>
      <Pressable style>
        <Text style={styles.headerRightText} numberOfLines={2}>
          {(item.is_online ? '오프라인' : '온라인') + '\n상품 보기'}
        </Text>
      </Pressable>
    </Link>
  );
});

const stylesheet = createStyleSheet(theme => ({
  headerRightText: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm * 1.2,
    textAlign: 'center',
    color: theme.colors.tint3,
    fontWeight: 'bold',
  },
}));

export default HeaderRightRelatedButton;
