import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase, resolveImageUrl } from '../supabase';
import { dummyProductsCache } from '../lib/dummyData';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit, filters }, { getState }) => {
    // 1. Fetch real products from Supabase
    let query = supabase
      .from('products')
      .select(`
        id, category_id, title, description, slug, is_active,
        categories (id, slug, title),
        product_variants!inner (
          id, price, is_active,
          product_media!inner ( media_url, media_type )
        )
      `)
      .eq('is_active', true)
      .eq('product_variants.is_active', true);

    if (filters.category) {
      // If filtering by category, we need to match the category slug
      // Supabase nested filtering can be tricky, so we join and filter.
      query = query.eq('categories.slug', filters.category);
    }

    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: realProducts, error } = await query;
    if (error) {
      console.error('Error fetching real products:', error);
      throw error;
    }

    // Process real products
    const processedReal = (realProducts || []).map(p => {
      // Find min price
      const prices = p.product_variants.map(v => v.price);
      const minPrice = Math.min(...prices);

      // Find first image
      let coverImage = null;
      for (const v of p.product_variants) {
        const img = v.product_media.find(m => m.media_type === 'image');
        if (img) {
          coverImage = img.media_url;
          break;
        }
      }

      return {
        ...p,
        price: minPrice,
        coverImage: resolveImageUrl(coverImage)
      };
    });

    // 2. Process Dummy Products
    let dummyToReturn = [];
    
    // We only load dummy products on the first page to simulate them existing in the database
    // But since pagination is requested, we can slice the dummy cache as if it's part of the DB.
    let filteredDummies = dummyProductsCache;
    
    if (filters.category) {
      filteredDummies = filteredDummies.filter(d => d.category.slug === filters.category);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filteredDummies = filteredDummies.filter(d => 
        d.title.toLowerCase().includes(term) || d.description.toLowerCase().includes(term)
      );
    }

    // Apply pagination to dummies
    dummyToReturn = filteredDummies.slice(from, from + limit);

    // Filter by price (both real and dummy)
    let combined = [...processedReal, ...dummyToReturn.map(d => ({
      ...d, 
      price: d.product_variants[0]?.price || 0,
      coverImage: d.product_variants[0]?.product_media[0]?.media_url
    }))];

    if (filters.minPrice !== null && filters.minPrice !== '') {
      combined = combined.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice !== null && filters.maxPrice !== '') {
      combined = combined.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    return {
      products: combined,
      page,
      hasMore: realProducts.length === limit || dummyToReturn.length === limit
    };
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    hasMore: true
  },
  filters: {
    category: '',
    search: '',
    minPrice: '',
    maxPrice: ''
  },
  lastFetched: null
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset pagination when filters change
      state.pagination.page = 1;
      state.pagination.hasMore = true;
      state.items = [];
      state.status = 'idle'; // Force re-fetch
    },
    incrementPage: (state) => {
      state.pagination.page += 1;
    },
    resetProducts: (state) => {
      state.items = [];
      state.pagination.page = 1;
      state.pagination.hasMore = true;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        // If we are on page 1 and have no items, we are loading fresh
        if (action.meta.arg.page === 1 && state.items.length === 0) {
          state.status = 'loading';
        } else {
          // Silent refresh or load more
          state.status = 'loading_more';
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.lastFetched = Date.now();
        state.pagination.hasMore = action.payload.hasMore;
        
        if (action.payload.page === 1) {
          state.items = action.payload.products;
        } else {
          // Filter out duplicates if any (though shouldn't happen with strict pagination)
          const newItems = action.payload.products.filter(
            p => !state.items.find(existing => existing.id === p.id)
          );
          state.items = [...state.items, ...newItems];
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setFilters, incrementPage, resetProducts } = productsSlice.actions;

export default productsSlice.reducer;
