import { login } from "@/features/auth/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { User } from "../auth/RegistrationForm";

// Define login form data type
interface LoginFormData {
  username: string;
  password: string;
}

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
  const [isUserNotRegistered, setIsUserNotRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError(null);
    setIsUserNotRegistered(false);

    try {
      // Get registered users from localStorage
      const storedUsers = localStorage.getItem("registered_users");

      if (!storedUsers) {
        setIsUserNotRegistered(true);
        setLoginError("No registered users found. Please register first.");
        setIsLoading(false);
        return;
      }

      const users: User[] = JSON.parse(storedUsers);

      // Check if user exists by username or email
      const user = users.find(
        (u) => u.username === data.username || u.email === data.username
      );

      if (!user) {
        setIsUserNotRegistered(true);
        setLoginError("User not registered. Please create an account first.");
        setIsLoading(false);
        return;
      }

      // Check password
      if (user.password !== data.password) {
        setLoginError(
          "Invalid credentials. Please check your username and password."
        );
        setIsLoading(false);
        return;
      }

      // Successful login - create user data for Redux without password
      const userForLogin = {
        firstName: user.firstName,
        lastName: user.lastName || "",
        username: user.username,
        email: user.email,
      };

      // Dispatch login action
      dispatch(login(userForLogin));

      // Save login state to session
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("currentUser", JSON.stringify(userForLogin));

      console.log("User logged in successfully:", user.username);
      setIsLoading(false);
      onSuccess();
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 400, mx: "auto" }}
    >
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>

      {loginError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            isUserNotRegistered && (
              <Link href="/register" passHref>
                <MuiLink component="button" variant="body2" color="inherit">
                  Register
                </MuiLink>
              </Link>
            )
          }
        >
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

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Don&apos;t have an account?{" "}
          <Link href="/register" passHref>
            <MuiLink component="span" sx={{ cursor: "pointer" }}>
              Register now
            </MuiLink>
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
