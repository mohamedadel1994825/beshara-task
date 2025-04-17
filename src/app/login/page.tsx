// src/app/login/page.tsx
"use client";

import LoginForm from "@/components/auth/forms/LoginForm";
import { Box } from "@mui/material";

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        p: 3,
      }}
    >
      <LoginForm />
    </Box>
  );
}
