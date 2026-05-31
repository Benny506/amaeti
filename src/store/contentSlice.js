import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabase';

export const fetchAllContent = createAsyncThunk(
  'content/fetchAllContent',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('page_slug, content');
        
      if (error) {
        return rejectWithValue(error.message);
      }

      const pagesObj = {};
      data.forEach(row => {
        pagesObj[row.page_slug] = row.content;
      });
      return pagesObj;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  pages: {}, // e.g. { home: { ...json }, about: { ...json }, contact: { ...json } }
  loading: { global: false },
  error: null,
};

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllContent.pending, (state) => {
        state.loading.global = true;
        state.error = null;
      })
      .addCase(fetchAllContent.fulfilled, (state, action) => {
        state.loading.global = false;
        state.pages = action.payload; // Map the entire DB into memory
      })
      .addCase(fetchAllContent.rejected, (state, action) => {
        state.loading.global = false;
        state.error = action.payload;
      });
  },
});

export default contentSlice.reducer;
