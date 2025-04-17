// src/app/login/page.tsx
"use client";

import LoginForm from "@/components/auth/forms/LoginForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Box } from "@mui/material";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
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
    </Suspense>
  );
}
