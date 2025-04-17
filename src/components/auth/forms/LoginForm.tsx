// components/forms/LoginForm.tsx
"use client";

import { loginSchema } from "@/schemas/authSchemas";
import { login } from "@/store/slices/authSlice";
import { setUserId } from "@/store/slices/cartSlice";
import { User } from "@/types/user";
import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

type FormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<{
    id: number;
    returnTo: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setShowRegistrationSuccess(true);
    }

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

  const onSubmit = (data: FormData) => {
    const existingUsers = localStorage.getItem("registered_users");
    const users: User[] = existingUsers ? JSON.parse(existingUsers) : [];
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();
    console.log("users", users);

    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    console.log("user", user);
    if (user) {
      document.cookie = "auth=true; path=/";
      localStorage.setItem("currentUser", JSON.stringify(user));
      dispatch(login(user));
      dispatch(setUserId(user.username));
      if (pendingCartItem) {
        router.push(`/product/${pendingCartItem.id}`);
      } else {
        const from = searchParams.get("from");
        router.push(from || "/");
      }
    } else {
      setError("Invalid email or password");
    }
  };

  return (
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
          Registration successful! Please log in.
        </Alert>
      )}

      {pendingCartItem && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Please log in to add items to your cart.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
        Login
      </Button>

      <Button variant="text" fullWidth onClick={() => router.push("/register")}>
        Don&apos;t have an account? Register
      </Button>
    </Box>
  );
}
