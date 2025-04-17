"use client";

import { login } from "@/store/slices/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for existing authentication
    const isAuthenticated = document.cookie.includes("auth=true");
    const userStr = localStorage.getItem("currentUser");

    if (isAuthenticated && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(login(user));
      } catch (error) {
        console.error("Error initializing auth state:", error);
        // Clear invalid auth data
        document.cookie =
          "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        localStorage.removeItem("currentUser");
      }
    }
  }, [dispatch]);

  return null;
}
