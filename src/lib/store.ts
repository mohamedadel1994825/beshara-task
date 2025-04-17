import authReducer from '@/store/slices/authSlice';
import cartReducer from '@/features/cart/cartSlice';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        cart: cartReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 