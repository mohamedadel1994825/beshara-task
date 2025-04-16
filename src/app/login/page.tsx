"use client";

import { login } from "@/features/auth/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<{
    id: number;
    returnTo: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Check for registration success
    if (searchParams.get("registered") === "true") {
      setShowRegistrationSuccess(true);
    }

    // Check for pending cart item
    try {
      const storedItem = sessionStorage.getItem("pendingCartItem");
      if (storedItem) {
        setPendingCartItem(JSON.parse(storedItem));
        sessionStorage.removeItem("pendingCartItem");
      }
    } catch (error) {
      console.error("Error reading from sessionStorage:", error);
    }
  }, [searchParams]);

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      // Check if user exists in localStorage
      const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u: User) =>
          u.username === data.username && u.password === data.password
      );

      if (user) {
        // Set auth cookie
        document.cookie = "auth=true; path=/";

        // Dispatch login action
        dispatch(login(user));

        // Handle redirection
        if (pendingCartItem) {
          router.push(`/product/${pendingCartItem.id}`);
        } else {
          const from = searchParams.get("from");
          router.push(from || "/");
        }
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        p: 3,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>

        {showRegistrationSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful! Please log in with your credentials.
          </Alert>
        )}

        {pendingCartItem && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Please log in to add items to your cart
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Username"
          {...register("username")}
          error={!!errors.username}
          helperText={errors.username?.message}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
          Login
        </Button>

        <Button
          variant="text"
          fullWidth
          onClick={() => router.push("/register")}
        >
          Don&apos;t have an account? Register
        </Button>
      </Box>
    </Box>
  );
}
