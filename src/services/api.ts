import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: () => ({}),
    tagTypes: ['Auth', 'Cart', 'Products','Categories'],
});

// The following functions are removed as they conflict with RTK Query setup
// and standard usage involves using hooks from generated slices.
/*
export const getCategories = async () => {
    try {
        const response = await api.get('/products/categories');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch categories');
    }
};

export const getProductsByCategory = async (category: string) => {
    try {
        const response = await api.get(`/products/category/${category}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch products');
    }
};

export const getProductById = async (id: number) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch product details');
    }
};
*/ 