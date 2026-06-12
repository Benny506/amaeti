import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  profile: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData(state, action) {
      state.user = action.payload.user;
      state.profile = action.payload.profile;
    },
    clearAuthData(state) {
      state.user = null;
      state.profile = null;
    },
    setInitialized(state, action) {
      state.isInitialized = action.payload;
    },
  },
});

export const { setAuthData, clearAuthData, setInitialized } = authSlice.actions;
export default authSlice.reducer;
