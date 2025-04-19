
// src/components/checkout/PaymentForm.tsx
import React from 'react';
import { 
  Grid, 
  TextField, 
  Typography, 
  FormControlLabel, 
  Checkbox, 
  Button,
  Box,
  InputAdornment
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';

interface PaymentFormProps {
  initialData: any;
  onSubmit: (data: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ initialData, onSubmit }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="cardName"
            control={control}
            rules={{ required: 'Name on card is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name on card"
                fullWidth
                variant="outlined"
                error={!!errors.cardName}
                helperText={errors.cardName?.message?.toString()}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="cardNumber"
            control={control}
            rules={{ 
              required: 'Card number is required',
              pattern: {
                value: /^[0-9]{16}$/,
                message: 'Please enter a valid 16-digit card number'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Card number"
                fullWidth
                variant="outlined"
                error={!!errors.cardNumber}
                helperText={errors.cardNumber?.message?.toString()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCardIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Controller
            name="expDate"
            control={control}
            rules={{ 
              required: 'Expiration date is required',
              pattern: {
                value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                message: 'Please use MM/YY format'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Expiry date (MM/YY)"
                fullWidth
                variant="outlined"
                placeholder="MM/YY"
                error={!!errors.expDate}
                helperText={errors.expDate?.message?.toString()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Controller
            name="cvv"
            control={control}
            rules={{ 
              required: 'CVV is required',
              pattern: {
                value: /^[0-9]{3,4}$/,
                message: 'Please enter a valid CVV'
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="CVV"
                fullWidth
                variant="outlined"
                error={!!errors.cvv}
                helperText={errors.cvv?.message?.toString()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Controller
            name="saveCard"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={field.onChange}
                    color="primary"
                  />
                }
                label="Remember credit card details for next time"
              />
            )}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button type="submit" variant="contained" color="primary">
          Continue to Review
        </Button>
      </Box>
    </form>
  );
};

export default PaymentForm;
