import { useCallback, useMemo, useState } from 'react';

export function useSort<T>({
  sortOptions,
  callback,
  initialSort,
}: {
  sortOptions: T;
  callback: (sort: keyof T) => void;
  initialSort: keyof T;
}) {
  const [sort, setSort] = useState<keyof T>(initialSort);

  const handleSortChange = useCallback(
    (sort: keyof T) => {
      setSort(sort);
      callback(sort);
    },
    [callback],
  );

  const sortOption = useMemo(() => sortOptions[sort], [sort, sortOptions]);

  return {
    sort,
    handleSortChange,
    sortOption,
  };
}
