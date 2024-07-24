import { CategorySectors } from '@cococom/supabase/libs';
import { create } from 'zustand';

interface CategorySectorsState {
  categorySectorsArray: CategorySectors[] | null;
  setCategorySectorsArray: (categorySectorsArray: CategorySectors[] | null) => void;
}

export const useCategorySectorsStore = create<CategorySectorsState>()(set => ({
  categorySectorsArray: null,
  setCategorySectorsArray: categorySectorsArray => set({ categorySectorsArray }),
}));
