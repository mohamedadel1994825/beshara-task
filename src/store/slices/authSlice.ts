// // src/store/slices/authSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { User } from "@/types/user";

// interface AuthState {
//   user: User | null;
//   isAuthenticated: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   isAuthenticated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     login: (state, action: PayloadAction<User>) => {
//       state.user = action.payload;
//       state.isAuthenticated = true;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.isAuthenticated = false;
//     },
//   },
// });

// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;
import { api } from '@/lib/api';
import { User } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthUser = Pick<User, "username" | "email" | "firstName" | "lastName" | "userId">;


interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
}

// Load initial state from cookies if available
const loadInitialState = (): AuthState => {
    if (typeof window !== 'undefined') {
        const isAuthenticated = document.cookie.includes('auth=true');
        const userStr = localStorage.getItem('currentUser');
        const user = userStr ? JSON.parse(userStr) : null;
        return {
            user,
            isAuthenticated,
        };
    }
    return {
        user: null,
        isAuthenticated: false,
    };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AuthUser>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            // Save user to localStorage
            localStorage.setItem('currentUser', JSON.stringify(action.payload));
            // Set auth cookie
            document.cookie = 'auth=true; path=/';
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            // Remove user from localStorage
            localStorage.removeItem('currentUser');
            // Remove auth cookie
            document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        },

    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        getProfile: builder.query({
            query: () => '/auth/profile',
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetProfileQuery,
} = authApi; 