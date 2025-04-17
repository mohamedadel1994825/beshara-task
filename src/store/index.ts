// // src/store/index.ts
// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";
// // Import other reducers as needed

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     // Add other reducers here
//   },
// });

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
import authReducer from '@/store/slices/authSlice';
import cartReducer from '@/store/slices/cartSlice';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '../services/api';

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