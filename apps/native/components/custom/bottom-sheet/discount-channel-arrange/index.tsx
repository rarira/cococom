import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { ForwardedRef, forwardRef, memo, useCallback } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BottomSheet from '@/components/core/bottom-sheet';
import Text from '@/components/core/text';
import { DiscountChannels } from '@/constants';
import { RotateButtonOption } from '@/hooks/discount/useDiscountRotateButton';
import { useDiscountChannelsArrange } from '@/hooks/settings/useDiscountChannelArrange';
import DraggableList from '@/components/core/draggable-list';
import DraggableListItem from '@/components/core/draggable-list/item';
import { ItemPositions } from '@/libs/draggable-list';

import InfoIconText from '../../text/info-icon';

const ITEM_HEIGHT = 40;

const DiscountChannelArrangeBottomSheet = memo(
  forwardRef(function DiscountChannelArrangeBottomSheet(
    _props,
    ref: ForwardedRef<BottomSheetModal>,
  ) {
    const { styles } = useStyles(stylesheet);
    const { handleUpdate, discountChannels } = useDiscountChannelsArrange();

    const handleDragEnd = useCallback(
      (newItemPositions: ItemPositions) => {
        const newChannels: (RotateButtonOption<DiscountChannels> | null)[] = Array.from(
          discountChannels,
          x => null,
        );

        for (const position in newItemPositions) {
          const index = newItemPositions[position].updatedIndex;
          newChannels[index] = discountChannels.find(x => x.id === Number(position))!;
        }

        handleUpdate(newChannels.filter(x => x !== null) as RotateButtonOption<DiscountChannels>[]);
      },
      [discountChannels, handleUpdate],
    );
    return (
      <BottomSheet ref={ref} snapPoints={['38%']} index={1} title="채널 검색 순서 변경">
        <Text style={styles.subTitle}>
          {`드래그하여 순서를 변경하세요.\n가장 위에 있는 채널이 기본값입니다.`}
        </Text>

        <DraggableList
          items={discountChannels}
          itemHeight={ITEM_HEIGHT}
          style={[styles.container, { height: discountChannels.length * ITEM_HEIGHT }]}
          onDragEnd={handleDragEnd}
        >
          {discountChannels.map(item => (
            <DiscountChannelItem key={item.value} item={item} />
          ))}
        </DraggableList>
      </BottomSheet>
    );
  }),
);

const DiscountChannelItem = memo(function ({
  item,
}: {
  item: RotateButtonOption<DiscountChannels>;
}) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <DraggableListItem item={item} containerStyle={styles.listContainer}>
      <InfoIconText
        key={item.value}
        textProps={{
          style: styles.text,
          children: `${item.text}${item.fullText ? ` (${item.fullText})` : ''}`,
        }}
        iconProps={{
          font: { type: 'MaterialIcon', name: 'drag-indicator' },
          size: theme.fontSize.lg,
        }}
      />
    </DraggableListItem>
  );
});

DiscountChannelItem.displayName = 'DiscountChannelItem';
const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  listContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    height: ITEM_HEIGHT,
    width: '80%',
  },
  subTitle: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.typography,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  text: {
    fontSize: theme.fontSize.md,
    color: theme.colors.typography,
  },
}));

export default DiscountChannelArrangeBottomSheet;
