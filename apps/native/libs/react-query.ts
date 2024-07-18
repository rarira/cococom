export const queryKeys = {
  discounts: {
    currentList: (userId?: string | null) => [
      'discounts',
      { userId, currentTimestamp: new Date().toISOString().split('T')[0] },
    ],
  },
};
