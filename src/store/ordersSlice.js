import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action) {
      state.items = action.payload;
      state.status = 'succeeded';
    },
    setOrdersStatus(state, action) {
      state.status = action.payload;
    },
  },
});

export const { setOrders, setOrdersStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
