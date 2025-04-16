import { login, useLoginMutation } from "@/features/auth/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup.string().required("Username or email is required"),
  password: yup.string().required("Password is required"),
});

interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginUser, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoginError(null);
      // In a real application, you would use the API endpoint
      // For demo purposes, we'll simulate a successful login
      // const response = await loginUser(data).unwrap();

      // Simulate successful login with mock user data
      const userData = {
        firstName: "Demo",
        lastName: "User",
        username: data.username,
        email: "demo@example.com",
      };

      dispatch(login(userData));
      onSuccess();
    } catch (error: any) {
      setLoginError(
        error?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 400, mx: "auto", p: 3 }}
    >
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>

      {loginError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loginError}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Username or Email"
        {...register("username")}
        error={!!errors.username}
        helperText={errors.username?.message}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        margin="normal"
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{ mt: 3 }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Login"}
      </Button>
    </Box>
  );
};

export default LoginForm;
