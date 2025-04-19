// src/app/checkout/page.tsx or src/pages/checkout/index.tsx
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
import { useSelector } from "react-redux";

// Step components
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentForm from "@/components/checkout/PaymentForm";
import ShippingForm from "@/components/checkout/ShippingForm";

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

  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      // Handle order submission
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
      // Mock API call - replace with actual order submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Process successful
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
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Checkout
        </Typography>
        {activeStep < steps.length - 1 && (
          <Button
            variant="outlined"
            component={Link}
            href="/cart"
            startIcon={<ArrowBackIcon />}
          >
            Back to Cart
          </Button>
        )}
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        {renderStepContent(activeStep)}
      </Paper>

      {activeStep < steps.length - 1 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <div>
            {activeStep === steps.length - 2 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Place Order"}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={activeStep === 0 || activeStep === 1}
              >
                Next
              </Button>
            )}
          </div>
        </Box>
      )}

      {activeStep === steps.length - 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="contained" color="primary" component={Link} href="/">
            Continue Shopping
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CheckoutPage;
