import { Tables } from '@cococom/supabase/types';
import { memo, useCallback } from 'react';
import { View } from 'react-native';
import { Cell, Row, Table, TableWrapper } from 'react-native-reanimated-table';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import Text from '@/components/core/text';
import { formatDashedDate } from '@/libs/date';

interface HistoryTableProps {
  data: Omit<Tables<'histories'>, 'no_images' | 'no_price'>[];
}

const HistoryTable = memo(function HistoryTable({ data }: HistoryTableProps) {
  const { styles } = useStyles(stylesheet);

  const renderType = useCallback(
    (isOnline: boolean) => {
      return (
        <View style={styles.column}>
          <Text style={styles.cellText}>{isOnline ? '온라인' : '오프라인'}</Text>
        </View>
      );
    },
    [styles.cellText, styles.column],
  );

  return (
    <Table style={styles.table}>
      <Row
        data={['구분', '신규 할인 수', '신규 싱품 수', '업데이트일']}
        flexArr={[2, 2, 2, 3]}
        style={styles.headerRow}
        textStyle={styles.headerText}
      />
      {data.map(history => (
        <TableWrapper key={history.id} style={styles.row}>
          <Cell flex={2} data={renderType(history.is_online)} />
          <Cell flex={2} data={history.added_discount_count} textStyle={styles.cellText} />
          <Cell flex={2} data={history.new_item_count} textStyle={styles.cellText} />
          <Cell flex={3} data={formatDashedDate(history.created_at)} textStyle={styles.cellText} />
        </TableWrapper>
      ))}
    </Table>
  );
});

const stylesheet = createStyleSheet(theme => ({
  table: { marginTop: theme.spacing.sm },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    gap: theme.spacing.md,
  },
  headerText: {
    fontWeight: 'semibold',
    fontSize: theme.fontSize.normal,
    color: 'white',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    color: 'white',
    fontSize: theme.fontSize.sm,
    lineHeight: theme.fontSize.sm,
    textAlign: 'center',
  },
}));

export default HistoryTable;
