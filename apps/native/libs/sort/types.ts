export type SortOptions = Record<string, SortOption>;

export type SortOption = {
  field: string;
  orderBy: 'ASC' | 'DESC';
  text: string;
  authRequired?: boolean;
};
