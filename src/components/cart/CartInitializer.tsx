// src/components/CartInitializer.tsx
"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeCart } from '@/store/slices/cartSlice';

export default function CartInitializer() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Initialize cart on app load
    dispatch(initializeCart());
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}