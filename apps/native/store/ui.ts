import { create } from 'zustand';

interface UIState {
  modalOpened: boolean;
  toggleModalOpened: () => void;
}

export const useUIStore = create<UIState>()(set => ({
  modalOpened: false,
  toggleModalOpened: () => set(state => ({ modalOpened: !state.modalOpened })),
}));
