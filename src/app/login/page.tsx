"use client";

import LoginForm from "@/components/auth/LoginForm";
import { Box, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push("/");
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
      <Paper elevation={3} sx={{ width: "100%", maxWidth: 500, p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
          Login to Your Account
        </Typography>

        <LoginForm onSuccess={handleLoginSuccess} />

      
      </Paper>
    </Box>
  );
};

export default LoginPage;
