import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase, resolveImageUrl } from '../supabase';
import { dummyCategoriesCache } from '../lib/dummyData';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState }) => {
    const { categories } = getState();
    // Use cache if fetched less than 5 minutes ago
    if (categories.lastFetched && (Date.now() - categories.lastFetched < 300000)) {
      return categories.items;
    }

    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        slug,
        title,
        description,
        products!inner (
          id,
          is_active,
          product_variants!inner (
            id,
            is_active,
            product_media!inner (
              media_url,
              media_type
            )
          )
        )
      `)
      .eq('products.is_active', true)
      .eq('products.product_variants.is_active', true);

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    const processedCategories = data.map((category) => {
      const allMedia = [];
      category.products.forEach(product => {
        product.product_variants.forEach(variant => {
          variant.product_media.forEach(media => {
            if (media.media_type === 'image') {
              allMedia.push(media.media_url);
            }
          });
        });
      });

      const randomImage = allMedia.length > 0
        ? allMedia[Math.floor(Math.random() * allMedia.length)]
        : null;

      return {
        id: category.id,
        slug: category.slug,
        title: category.title,
        description: category.description,
        coverImage: resolveImageUrl(randomImage)
      };
    });

    const validRealCategories = processedCategories.filter(c => c.coverImage);
    const dummyCategories = dummyCategoriesCache;
    
    return [...validRealCategories, ...dummyCategories];
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  lastFetched: null
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        if (state.items.length === 0) {
          state.status = 'loading';
        } else {
          state.status = 'refreshing';
        }
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default categoriesSlice.reducer;
