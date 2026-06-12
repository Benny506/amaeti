import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabase';

// Helper to calculate total from items
const calculateTotals = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const syncCartWithDB = createAsyncThunk(
  'cart/syncCartWithDB',
  async (_, { getState }) => {
    const { auth } = getState(); // Assuming there's an auth slice. If not, we use supabase auth.
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) return null;

    const { cart } = getState();
    const localItems = cart.items;

    // 1. Fetch DB Cart
    let { data: dbCart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // If no cart, create one
    if (!dbCart) {
      const { data: newCart } = await supabase
        .from('carts')
        .insert({ user_id: user.id })
        .select('id')
        .single();
      dbCart = newCart;
    }

    if (!dbCart) throw new Error('Failed to create or fetch cart');

    // 2. Sync Items (Simplified: we'll push local items that don't exist, and fetch final list)
    // For a real production app, you'd want a more complex merge strategy.
    
    const { data: dbItems } = await supabase
      .from('cart_items')
      .select(`
        id, variant_id, quantity,
        product_variants ( price ),
        products ( id, title, slug )
      `)
      .eq('cart_id', dbCart.id);

    // Merge logic would go here. For now, we'll just fetch what's in DB 
    // and if localItems exist but DB is empty, we push them.
    
    if (localItems.length > 0 && (!dbItems || dbItems.length === 0)) {
      const itemsToInsert = localItems.map(item => ({
        cart_id: dbCart.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity
      }));
      
      await supabase.from('cart_items').insert(itemsToInsert);
    }

    // Refetch final unified cart
    const { data: finalItems } = await supabase
      .from('cart_items')
      .select(`
        id, cart_id, product_id, variant_id, quantity,
        product_variants ( price, weight, inventory_quantity, attributes, product_media ( media_url, media_type ) ),
        products ( title, slug )
      `)
      .eq('cart_id', dbCart.id);

    return {
      id: dbCart.id,
      user_id: user.id,
      items: finalItems.map(item => ({
        id: item.id, // db item id
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.product_variants.price,
        weight: item.product_variants.weight || 1.0,
        inventory_quantity: item.product_variants.inventory_quantity,
        attributes: item.product_variants.attributes,
        title: item.products.title,
        slug: item.products.slug,
        image: item.product_variants.product_media?.find(m => m.media_type === 'image')?.media_url || null
      }))
    };
  }
);

const initialState = {
  id: null, // 'local' or db uuid
  user_id: null,
  items: [],
  isOpen: false,
  status: 'idle',
};

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ variant_id, quantity }, { getState, dispatch }) => {
    // 1. Update local Redux state first (optimistic)
    dispatch(cartSlice.actions.updateQuantity({ variant_id, quantity }));

    // 2. Check if we have a cart_id in DB to sync with
    const { cart } = getState();
    const item = cart.items.find(i => i.variant_id === variant_id);
    if (!item || !item.id || String(item.id).startsWith('local-')) {
      return; // Not synced to DB yet, nothing to do
    }

    // 3. Sync to DB
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: Math.max(1, quantity) })
      .eq('id', item.id);
      
    if (error) console.error("Failed to update cart item in DB", error);
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (variant_id, { getState, dispatch }) => {
    const { cart } = getState();
    const item = cart.items.find(i => i.variant_id === variant_id);
    
    // 1. Optimistic update
    dispatch(cartSlice.actions.removeFromCart(variant_id));

    if (!item || !item.id || String(item.id).startsWith('local-')) return;

    // 2. DB delete
    await supabase.from('cart_items').delete().eq('id', item.id);
  }
);

export const addCartItemAsync = createAsyncThunk(
  'cart/addCartItemAsync',
  async (payload, { getState, dispatch, rejectWithValue }) => {
    const { cart } = getState();
    const { product_id, variant_id, quantity } = payload;
    
    let dbItemId = null;

    if (cart.id && !String(cart.id).startsWith('local-')) {
      const existingItem = cart.items.find(i => i.variant_id === variant_id);
      
      if (existingItem && existingItem.id && !String(existingItem.id).startsWith('local-')) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
        if (error) throw new Error(error.message);
        dbItemId = existingItem.id;
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            product_id,
            variant_id,
            quantity
          })
          .select('id')
          .single();
        if (error) throw new Error(error.message);
        dbItemId = data.id;
      }
    }
    
    dispatch(cartSlice.actions.addToCart({ ...payload, id: dbItemId }));
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    addToCart: (state, action) => {
      const { id, product_id, variant_id, quantity, price, title, slug, image, weight, attributes } = action.payload;
      
      // Real products check: We assume dummy products have a specific structure or we strictly prevent them at UI level
      const existingItemIndex = state.items.findIndex(item => item.variant_id === variant_id);
      
      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          id: id || `local-${Date.now()}`,
          product_id,
          variant_id,
          quantity,
          price,
          title,
          slug,
          image,
          weight: weight || 1.0,
          attributes: attributes || null
        });
      }
      state.isOpen = true; // Open cart on add
    },
    removeFromCart: (state, action) => {
      const variant_id = action.payload;
      state.items = state.items.filter(item => item.variant_id !== variant_id);
    },
    updateQuantity: (state, action) => {
      const { variant_id, quantity } = action.payload;
      const item = state.items.find(item => item.variant_id === variant_id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(syncCartWithDB.fulfilled, (state, action) => {
      if (action.payload) {
        state.id = action.payload.id;
        state.user_id = action.payload.user_id;
        state.items = action.payload.items;
      }
    });
  }
});

export const { toggleCart, setCartOpen, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartTotal = (state) => calculateTotals(state.cart.items);
export const selectCartItemCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);

export default cartSlice.reducer;
