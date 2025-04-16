import { login } from "@/features/auth/authSlice";
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

// Define user interface with optional fields
export interface User {
  firstName: string;
  lastName: string | undefined;
  username: string;
  password: string;
  email: string;
  address?: string;
}

// Define the form data type
export type RegisterFormData = {
  firstName: string;
  lastName?: string;
  username: string;
  password: string;
  email: string;
  address?: string;
};

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string(),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  address: yup.string(),
});

interface RegistrationFormProps {
  onSuccess: () => void;
}

const RegistrationForm = ({ onSuccess }: RegistrationFormProps) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData: RegisterFormData) => {
    setIsLoading(true);
    setRegistrationError(null);

    try {
      // Check if username or email already exists
      const existingUsers = localStorage.getItem("registered_users");
      const users: User[] = existingUsers ? JSON.parse(existingUsers) : [];

      const usernameExists = users.some(
        (user) => user.username === formData.username
      );
      if (usernameExists) {
        setRegistrationError(
          "Username already exists. Please choose another one."
        );
        setIsLoading(false);
        return;
      }

      const emailExists = users.some((user) => user.email === formData.email);
      if (emailExists) {
        setRegistrationError(
          "Email already exists. Please use another email or login."
        );
        setIsLoading(false);
        return;
      }

      // Create user object from form data
      const userData: User = {
        firstName: formData.firstName,
        lastName: formData.lastName || undefined,
        username: formData.username,
        password: formData.password,
        email: formData.email,
        address: formData.address,
      };

      // Add the new user to localStorage
      users.push(userData);
      localStorage.setItem("registered_users", JSON.stringify(users));

      // Log the user in
      const userForLogin = {
        firstName: userData.firstName,
        lastName: userData.lastName || "",
        username: userData.username,
        email: userData.email,
      };

      dispatch(login(userForLogin));

      // Set session data
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("currentUser", JSON.stringify(userForLogin));

      console.log("User registered successfully:", userData.username);
      setIsLoading(false);
      onSuccess();
    } catch (error) {
      console.error("Registration error:", error);
      setRegistrationError("Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 400, mx: "auto", p: 3 }}
    >
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>

      {registrationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {registrationError}
        </Alert>
      )}

      <TextField
        fullWidth
        label="First Name"
        {...register("firstName")}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Last Name"
        {...register("lastName")}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Username"
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

      <TextField
        fullWidth
        label="Email"
        type="email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Address"
        {...register("address")}
        error={!!errors.address}
        helperText={errors.address?.message}
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
        {isLoading ? <CircularProgress size={24} /> : "Register"}
      </Button>
    </Box>
  );
};

export default RegistrationForm;
