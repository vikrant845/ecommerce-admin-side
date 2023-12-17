import { createSlice } from "@reduxjs/toolkit";

interface ModalStateProps {
  isOpen: boolean;
}

const initialState: ModalStateProps = {
  isOpen: false
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    onOpen: (state) => { state.isOpen = true },
    onClose: (state) => { state.isOpen = false }
  }
});

export const { onOpen, onClose } = modalSlice.actions;
export default modalSlice.reducer;