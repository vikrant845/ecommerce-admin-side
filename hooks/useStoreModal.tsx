import { create } from "zustand";

interface useStoreModalProps {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
}

const useStoreModal = create<useStoreModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));