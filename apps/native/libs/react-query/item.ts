export const itemQueryKeys = {
  byId: (id: number, userId?: string) => ['items', 'byId', { id, userId }],
};
