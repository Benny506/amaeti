import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';

import contentReducer from './contentSlice';
import uiReducer from './uiSlice';
import productsReducer from './productsSlice';
import categoriesReducer from './categoriesSlice';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import ordersReducer from './ordersSlice';

// Custom storage wrapper to avoid Vite/redux-persist bundling issues
const customStorage = {
  getItem: (key) => {
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem: (key, item) => {
    window.localStorage.setItem(key, item);
    return Promise.resolve(item);
  },
  removeItem: (key) => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  }
};

const cartPersistConfig = {
  key: 'amaeti_cart',
  storage: customStorage,
  blacklist: ['isOpen', 'status']
};

const rootReducer = combineReducers({
  auth: authReducer,
  content: contentReducer,
  ui: uiReducer,
  products: productsReducer,
  categories: categoriesReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  orders: ordersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);
