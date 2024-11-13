import { create } from 'zustand';
import { CategorySectors } from '../../../packages/supabase/dist/lib/lib';

interface CategorySectorsState {
  categorySectorsArray: CategorySectors[] | null;
  setCategorySectorsArray: (categorySectorsArray: CategorySectors[] | null) => void;
}

export const useCategorySectorsStore = create<CategorySectorsState>()(set => ({
  categorySectorsArray: null,
  setCategorySectorsArray: categorySectorsArray => set({ categorySectorsArray }),
}));
