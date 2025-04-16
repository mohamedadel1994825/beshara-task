"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (
    data: Omit<User, "id"> & { confirmPassword: string }
  ) => {
    try {
      // Get existing users
      const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

      // Check if username or email already exists
      if (users.some((u) => u.username === data.username)) {
        setError("Username already exists");
        return;
      }
      if (users.some((u) => u.email === data.email)) {
        setError("Email already exists");
        return;
      }

      // Create new user
      const newUser: User = {
        id: Date.now(), // Simple ID generation
        username: data.username,
        email: data.email,
        password: data.password,
      };

      // Save user
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Redirect to login
      router.push("/login?registered=true");
    } catch (error) {
      console.error("Registration error:", error);
      setError("An error occurred during registration");
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
          Register
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
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
          type="password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
          Register
        </Button>

        <Button variant="text" fullWidth onClick={() => router.push("/login")}>
          Already have an account? Login
        </Button>
      </Box>
    </Box>
  );
}
