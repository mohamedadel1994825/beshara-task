// src/components/checkout/OrderConfirmation.tsx
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmailIcon from "@mui/icons-material/Email";
import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";

interface OrderConfirmationProps {
  orderNumber: string;
  shippingEmail: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderNumber,
  shippingEmail,
}) => {
  return (
    <Box sx={{ textAlign: "center", py: 3 }}>
      <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 2 }} />

      <Typography variant="h4" gutterBottom>
        Order Confirmed!
      </Typography>

      <Typography variant="h6" gutterBottom>
        Thank you for your purchase
      </Typography>

      <Typography variant="body1" gutterBottom>
        Your order number is: <strong>{orderNumber}</strong>
      </Typography>

      <Paper
        elevation={1}
        sx={{ p: 3, mt: 4, maxWidth: 600, mx: "auto", bgcolor: "grey.50" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <EmailIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body1">
            We have sent a confirmation email to{" "}
            <strong>{shippingEmail}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You will receive an email when your order has shipped. If you have any
          questions about your order, please contact our customer service team.
        </Typography>
      </Paper>
    </Box>
  );
};

export default OrderConfirmation;
