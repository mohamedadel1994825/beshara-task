import { api } from '@/lib/api';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartState {
    items: Product[];
}

// Load initial state from localStorage if available
const loadInitialState = (): CartState => {
    if (typeof window !== 'undefined') {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                return { items: JSON.parse(savedCart) };
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
        }
    }
    return { items: [] };
};

const initialState: CartState = loadInitialState();

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
            // Save to localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('cart', JSON.stringify(state.items));
                } catch (error) {
                    console.error('Error saving cart to localStorage:', error);
                }
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            // Save to localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('cart', JSON.stringify(state.items));
                } catch (error) {
                    console.error('Error saving cart to localStorage:', error);
                }
            }
        },
        updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
                // Save to localStorage
                if (typeof window !== 'undefined') {
                    try {
                        localStorage.setItem('cart', JSON.stringify(state.items));
                    } catch (error) {
                        console.error('Error saving cart to localStorage:', error);
                    }
                }
            }
        },
        reorderItems: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
            // Save to localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('cart', JSON.stringify(state.items));
                } catch (error) {
                    console.error('Error saving cart to localStorage:', error);
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
            // Clear localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.removeItem('cart');
                } catch (error) {
                    console.error('Error clearing cart from localStorage:', error);
                }
            }
        },
    },
});

export const { addItem, removeItem, updateQuantity, reorderItems, clearCart } = cartSlice.actions;
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