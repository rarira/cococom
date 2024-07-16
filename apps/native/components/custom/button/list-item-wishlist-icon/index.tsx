import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ListItemCardProps } from '@/components/custom/card/list-item';
import IconButton from '@/components/ui/button/icon';
import { PortalHostNames } from '@/constants';
import { useUIStore } from '@/store/ui';

import NeedAuthDialog from '../../dialog/need-auth';

interface ListItemWishlistIconButtonProps extends Pick<ListItemCardProps, 'discount'> {}

function ListItemWishlistIconButton({ discount }: ListItemWishlistIconButtonProps) {
  const { styles, theme } = useStyles(stylesheet);
  const [needAuthDialogVisible, setNeedAuthDialogVisible] = useState(false);
  const { toggleModalOpened } = useUIStore();

  useLayoutEffect(() => {
    toggleModalOpened();
  }, [needAuthDialogVisible, toggleModalOpened]);

  const iconProps = useMemo(() => {
    const isWishlistedByUser = !!discount.userWishlistCount;
    return {
      name: isWishlistedByUser ? 'star' : ('star-border' as any),
      color: isWishlistedByUser ? theme.colors.alert : theme.colors.typography,
    };
  }, [discount.userWishlistCount, theme]);

  const handlePress = useCallback(() => {
    setNeedAuthDialogVisible(true);
  }, []);

  return (
    <>
      <IconButton
        text={discount.totalWishlistCount.toString()}
        textStyle={styles.text}
        iconProps={iconProps}
        onPress={handlePress}
      />
      {needAuthDialogVisible && (
        <NeedAuthDialog
          portalHostName={PortalHostNames.HOME}
          visible={needAuthDialogVisible}
          setVisible={setNeedAuthDialogVisible}
        />
      )}
    </>
  );
}

const stylesheet = createStyleSheet(theme => ({
  text: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm,
    opacity: 0.8,
  },
}));

export default ListItemWishlistIconButton;
