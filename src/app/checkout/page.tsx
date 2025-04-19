"use client";

import { RootState } from "@/store";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Step components
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentForm from "@/components/checkout/PaymentForm";
import ShippingForm from "@/components/checkout/ShippingForm";
import { clearCart } from "@/store/slices/cartSlice";

const steps = ["Shipping", "Payment", "Review", "Confirmation"];

const CheckoutPage: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    email: "",
    phone: "",
    saveAddress: false,
  });
  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
    saveCard: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      handlePlaceOrder();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingSubmit = (data: any) => {
    setShippingData(data);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePaymentSubmit = (data: any) => {
    setPaymentData(data);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      dispatch(clearCart());
      setActiveStep((prevStep) => prevStep + 1);
    } catch (err) {
      setError("There was an error processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ShippingForm
            initialData={shippingData}
            onSubmit={handleShippingSubmit}
          />
        );
      case 1:
        return (
          <PaymentForm
            initialData={paymentData}
            onSubmit={handlePaymentSubmit}
          />
        );
      case 2:
        return (
          <OrderSummary
            items={items}
            shippingData={shippingData}
            paymentData={paymentData}
          />
        );
      case 3:
        return (
          <OrderConfirmation
            orderNumber={"ORD-" + Math.floor(100000 + Math.random() * 900000)}
            shippingEmail={shippingData.email}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: 1200,
        mx: "auto",
        minWidth: 300, // Apply minWidth to ensure container doesn't shrink below this width
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
          gap: 2,
          minWidth: 300, // Apply minWidth to ensure header doesn't shrink below this width
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontSize={{ xs: "1.5rem", sm: "2rem" }}
        >
          Checkout
        </Typography>

        {activeStep < steps.length - 1 && (
          <Button
            variant="outlined"
            component={Link}
            href="/cart"
            startIcon={<ArrowBackIcon />}
            sx={{
              height: { xs: "36px", sm: "40px" },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 0.5, sm: 1 },
              alignSelf: { xs: "stretch", sm: "center" },
            }}
          >
            Back to Cart
          </Button>
        )}
      </Box>

      {/* Stepper */}
      <Box
        sx={{
          overflowX: "auto",
          mb: 4,
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome/Safari
          },
          minWidth: 300, // Apply minWidth to ensure stepper doesn't shrink below this width
        }}
      >
        <Stepper
          activeStep={activeStep}
          sx={{
            flexWrap: "nowrap",
            width: "max-content",
            minWidth: {
              xs: "100%", // Full width on mobile
              sm: "300px", // Set minimum width on tablets and up
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  whiteSpace: "nowrap",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Step Content */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 4, minWidth: 300 }}>
        {renderStepContent(activeStep)}
      </Paper>

      {/* Navigation Buttons */}
      {activeStep < steps.length - 1 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column-reverse", sm: "row" },
            justifyContent: "space-between",
            alignItems: "stretch",
            gap: 2,
            mt: 3,
            minWidth: 300, // Apply minWidth to ensure buttons don't shrink below this width
          }}
        >
          <Button
            fullWidth
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ height: 48 }}
          >
            Back
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={
              isSubmitting || activeStep === 0 || activeStep === 1 // optionally handle validation
            }
            sx={{ height: 48 }}
          >
            {activeStep === steps.length - 2 ? (
              isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Place Order"
              )
            ) : (
              "Next"
            )}
          </Button>
        </Box>
      )}

      {/* Continue Shopping on Last Step */}
      {activeStep === steps.length - 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            href="/"
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem" },
              px: { xs: 2, sm: 4 },
              py: { xs: 1, sm: 1.5 },
            }}
          >
            Continue Shopping
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CheckoutPage;
