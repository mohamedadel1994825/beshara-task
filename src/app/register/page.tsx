// pages/register.tsx

import RegistrationForm from "@/components/auth/forms/RegistrationForm";
import { Box, Typography } from "@mui/material";

export default function RegisterPage() {
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

      {/* Use the RegistrationForm component here */}
      <RegistrationForm />
    </Box>
  );
}
