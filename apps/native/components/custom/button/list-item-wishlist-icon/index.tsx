import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { ListItemCardProps } from '@/components/custom/card/list-item';
import IconButton from '@/components/ui/button/icon';
import { PortalHostNames } from '@/constants';
import useSession from '@/hooks/useSession';

import NeedAuthDialog from '../../dialog/need-auth';

interface ListItemWishlistIconButtonProps extends Pick<ListItemCardProps, 'discount'> {}

function ListItemWishlistIconButton({ discount }: ListItemWishlistIconButtonProps) {
  const { styles, theme } = useStyles(stylesheet);
  const [needAuthDialogVisible, setNeedAuthDialogVisible] = useState(false);
  const session = useSession();

  const idToBeWishlistedRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (session && needAuthDialogVisible) {
      setNeedAuthDialogVisible(false);
      if (idToBeWishlistedRef.current) {
        console.log('idToBeWishlistedRef.current is', idToBeWishlistedRef.current);
      }
    }
  }, [needAuthDialogVisible, session]);

  const iconProps = useMemo(() => {
    const isWishlistedByUser = !!discount.userWishlistCount;
    return {
      name: isWishlistedByUser ? 'star' : ('star-border' as any),
      color: isWishlistedByUser ? theme.colors.alert : theme.colors.typography,
    };
  }, [discount.userWishlistCount, theme]);

  const handlePress = useCallback(() => {
    if (!session) {
      idToBeWishlistedRef.current = discount.items.id;
      setNeedAuthDialogVisible(true);
      return;
    }
  }, [discount.items.id, session]);

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
          body="관심 상품 등록을 하시면 편리하게 쇼핑하실 수 있습니다. 로그인이 필요합니다"
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
