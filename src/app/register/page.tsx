"use client";

import RegistrationForm from "@/components/auth/RegistrationForm";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();

  const handleRegistrationSuccess = () => {
    router.push("/");
  };

  return (
    <Box>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Create an Account
        </Typography>
        <RegistrationForm onSuccess={handleRegistrationSuccess} />
      </Box>
    </Box>
  );
};

export default RegisterPage;
