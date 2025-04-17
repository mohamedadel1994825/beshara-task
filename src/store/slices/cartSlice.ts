import { getCartKey, saveCart } from '@/helpers/cart';
import { api } from '@/services/api';
import { Product } from '@/types/product';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface CartState {
    items: Product[];
    userId: string;
}

// Load initial state from localStorage if available
const loadInitialState = (userId: string): CartState => {
    if (typeof window !== 'undefined' && userId) {
        try {
            const savedCart = localStorage.getItem(getCartKey(userId));
            if (savedCart) {
                return { items: JSON.parse(savedCart), userId };
            }
        } catch (error) {
            console.error(`Error loading cart for ${userId}:`, error);
        }
    }
    return { items: [], userId };
};

const initialState: CartState = loadInitialState("");

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
            saveCart(state.userId, state.items);
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveCart(state.userId, state.items);
        },
        updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
                saveCart(state.userId, state.items);
            }
        },
        reorderItems: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
            saveCart(state.userId, state.items);
        },
        clearCart: (state) => {
            state.items = [];
            if (typeof window !== 'undefined' && state.userId) {
                try {
                    localStorage.removeItem(getCartKey(state.userId));
                } catch (error) {
                    console.error('Error clearing cart:', error);
                }
            }
        },
        setUserId: (state, action: PayloadAction<string>) => {
            state.userId = action.payload;
            const loaded = loadInitialState(action.payload);
            state.items = loaded.items;
        }
    },
});

export const {
    addItem,
    removeItem,
    updateQuantity,
    reorderItems,
    clearCart,
    setUserId,
} = cartSlice.actions;
export default cartSlice.reducer;

export const cartApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => '/cart',
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation({
            query: (product) => ({
                url: '/cart',
                method: 'POST',
                body: product,
            }),
            invalidatesTags: ['Cart'],
        }),
        updateCartItem: builder.mutation({
            query: ({ id, ...item }) => ({
                url: `/cart/${id}`,
                method: 'PUT',
                body: item,
            }),
            invalidatesTags: ['Cart'],
        }),
        removeFromCart: builder.mutation({
            query: (id) => ({
                url: `/cart/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
        clearCart: builder.mutation({
            query: () => ({
                url: '/cart/clear',
                method: 'POST',
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
} = cartApi; 