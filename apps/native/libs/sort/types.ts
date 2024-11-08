export type SortOptions = Record<string, SortOption>;

export type SortOption = {
  field: string;
  orderDirection: 'ASC' | 'DESC';
  text: string;
  authRequired?: boolean;
};
