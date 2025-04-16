// API service functions

// Types
export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fakestoreapi.com';

// Get all categories
export const getCategories = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_URL}/products/categories`);
        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products/category/${category}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch products for category ${category}: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error);
        throw error;
    }
};

// Get product by ID
export const getProductById = async (id: string | number): Promise<Product> => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch product ${id}: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
    }
}; 