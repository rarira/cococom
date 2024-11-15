export type ItemPositions = {
  [key: number]: {
    updatedIndex: number;
    updatedTop: number;
  };
};

export const getInitialPositions = (items: { id: number }[], itemHeight: number): ItemPositions => {
  let itemPositions: ItemPositions = {};
  for (let i = 0; i < items.length; i++) {
    itemPositions[items[i].id] = {
      updatedIndex: i,
      updatedTop: i * itemHeight,
    };
  }
  return itemPositions;
};

export const getKeyOfValue = (value: number, obj: ItemPositions): number | undefined => {
  'worklet';
  for (const [key, val] of Object.entries(obj)) {
    if (val.updatedIndex === value) {
      return Number(key);
    }
  }
  return undefined; // Return undefined if the value is not found
};
