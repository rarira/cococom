import { CategorySectors } from '@cococom/supabase/types';
import { createWithEqualityFn as create } from 'zustand/traditional';

interface CategorySectorsState {
  categorySectorsArray: CategorySectors[] | null;
  setCategorySectorsArray: (categorySectorsArray: CategorySectors[] | null) => void;
}

export const useCategorySectorsStore = create<CategorySectorsState>()(set => ({
  categorySectorsArray: null,
  setCategorySectorsArray: categorySectorsArray => set({ categorySectorsArray }),
}));
