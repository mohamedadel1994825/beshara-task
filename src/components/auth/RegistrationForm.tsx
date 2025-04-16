import { login } from "@/features/auth/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    // In a real application, you would send this data to your backend
    // For now, we'll just dispatch the login action
    dispatch(login(data));
    onSuccess();
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
        sx={{ mt: 3 }}
      >
        Register
      </Button>
    </Box>
  );
};

export default RegistrationForm;
 