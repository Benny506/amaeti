import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  blockingLoader: false,
  subtleLoader: {
    active: false,
    text: '',
  },
  toasts: [], // { id, type: 'success'|'error'|'warning'|'info', message }
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showBlockingLoader: (state, action) => {
      state.blockingLoader = action.payload || true;
    },
    hideBlockingLoader: (state) => {
      state.blockingLoader = false;
    },
    showSubtleLoader: (state, action) => {
      state.subtleLoader = {
        active: true,
        text: action.payload || 'Loading...',
      };
    },
    hideSubtleLoader: (state) => {
      state.subtleLoader.active = false;
    },
    addToast: (state, action) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      state.toasts.push({
        id,
        type: action.payload.type || 'info',
        message: action.payload.message,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
  },
});

export const { 
  showBlockingLoader, 
  hideBlockingLoader, 
  showSubtleLoader, 
  hideSubtleLoader, 
  addToast, 
  removeToast 
} = uiSlice.actions;

export default uiSlice.reducer;
