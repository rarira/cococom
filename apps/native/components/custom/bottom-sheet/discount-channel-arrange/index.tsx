import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { ForwardedRef, forwardRef, memo, useCallback } from 'react';
import DraggableFlatList, { RenderItem, ScaleDecorator } from 'react-native-draggable-flatlist';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import BottomSheet from '@/components/core/bottom-sheet';
import IconButton from '@/components/core/button/icon';
import Text from '@/components/core/text';
import { DiscountChannels } from '@/constants';
import { RotateButtonOption } from '@/hooks/discount/useDiscountRotateButton';
import { useDiscountChannelsArrange } from '@/hooks/settings/useDiscountChannelArrange';

const DiscountChannelArrangeBottomSheet = memo(
  forwardRef(function DiscountChannelArrangeBottomSheet(
    _props,
    ref: ForwardedRef<BottomSheetModal>,
  ) {
    const { styles, theme } = useStyles(stylesheet);
    const { handleUpdate, discountChannels } = useDiscountChannelsArrange();

    const renderItem: RenderItem<RotateButtonOption<DiscountChannels>> = useCallback(
      ({ item, drag, isActive }) => {
        return (
          <ScaleDecorator>
            <IconButton
              onPressIn={drag}
              key={item.value}
              style={styles.listContainer}
              disabled={isActive}
              text={`${item.text}${item.fullText ? ` (${item.fullText})` : ''}`}
              iconProps={{
                font: { type: 'MaterialIcon', name: 'drag-handle' },
                size: theme.fontSize.lg,
              }}
              textStyle={styles.text}
            />
          </ScaleDecorator>
        );
      },
      [styles, theme.fontSize.lg],
    );

    return (
      <BottomSheet ref={ref} snapPoints={['35%']} index={1} title="채널 검색 순서 변경">
        <Text style={styles.subTitle}>
          {`드래그하여 순서를 변경하세요.\n가장 위에 있는 채널이 기본값입니다.`}
        </Text>
        <DraggableFlatList
          data={discountChannels}
          onDragEnd={({ data }) => handleUpdate(data)}
          keyExtractor={item => item.value}
          renderItem={renderItem}
          scrollEnabled={false}
          containerStyle={styles.container}
          onDragBegin={() => console.log('drag begin')}
          onRelease={() => console.log('release')}
        />
      </BottomSheet>
    );
  }),
);

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: theme.screenHorizontalPadding,
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    marginVertical: theme.spacing.md,
    width: '100%',
    borderColor: theme.colors.shadow,
    borderWidth: 1,
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
