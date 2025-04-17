// src/types/cart.ts

export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
    // Add any other properties your cart items have
  }
  
  export interface ToastState {
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }