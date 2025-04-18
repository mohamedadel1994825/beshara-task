"use client"
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { contactSchema, ContactFormData } from "@/schemas/contactSchema";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  // Set up React Hook Form with Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
    mode: "onTouched", // Validate on blur
  });

  // Handle form submission
  const onSubmit = (data: ContactFormData) => {
    // Process form data
    console.log("Form submitted:", data);
    
    // Show success message
    setSubmitted(true);
    
    // Reset form
    reset();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          minWidth: { xs: "auto", sm: 250 },
          width: "100%",
        }}
      >
        Contact Us
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        paragraph
        sx={{
          minWidth: { xs: "auto", sm: 250 },
          width: "100%",
        }}
      >
        Have questions? We'd love to hear from you. Send us a message and we'll
        respond as soon as possible.
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6} sx={{ width: "100%" }}>
          <Card sx={{ p: 3, height: "100%", width: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Get in Touch
            </Typography>
            
            {submitted && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Thank you for your message! We'll get back to you soon.
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                id="name"
                label="Name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                id="email"
                label="Email"
                type="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                id="subject"
                label="Subject"
                {...register("subject")}
                error={!!errors.subject}
                helperText={errors.subject?.message}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                id="message"
                label="Message"
                multiline
                rows={4}
                {...register("message")}
                error={!!errors.message}
                helperText={errors.message?.message}
                margin="normal"
                required
              />
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
                disabled={isSubmitting}
              >
                Send Message
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} sx={{ width: "100%" }}>
          <Card sx={{ p: 3, height: "100%", width: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EmailIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography>support@beshara.com</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PhoneIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography>+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOnIcon sx={{ mr: 2, color: "primary.main" }} />
                <Typography>
                  123 E-Commerce Street
                  <br />
                  New York, NY 10001
                  <br />
                  United States
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Business Hours
              </Typography>
              <Typography>Monday - Friday: 9:00 AM - 6:00 PM</Typography>
              <Typography>Saturday: 10:00 AM - 4:00 PM</Typography>
              <Typography>Sunday: Closed</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}