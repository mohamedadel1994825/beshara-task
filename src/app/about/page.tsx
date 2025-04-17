"use client";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { Avatar, Box, Card, Container, Grid, Typography } from "@mui/material";

export default function AboutPage() {
  const features = [
    {
      icon: <StorefrontIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Wide Selection",
      description:
        "Discover a vast collection of high-quality products from trusted brands.",
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Fast Delivery",
      description: "Enjoy quick and reliable shipping to your doorstep.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Secure Shopping",
      description: "Shop with confidence using our secure payment system.",
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "24/7 Support",
      description: "Our customer service team is always here to help you.",
    },
  ];
const imagesBaseUrl='https://i.pravatar.cc'
  const teamMembers = [
    {
      name: "John Doe",
      role: "CEO & Founder",
      image: `${imagesBaseUrl}/120?img=18`,
    },
    {
      name: "Jane Smith",
      role: "Marketing Director",
      image: `${imagesBaseUrl}/120?img=12`,
    },
    {
      name: "Mike Johnson",
      role: "Product Manager",
      image: `${imagesBaseUrl}/120?img=8`,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About Beshara
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Your trusted destination for quality products and exceptional service
        </Typography>
      </Box>

      {/* Company Story */}
      <Card sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          Our Story
        </Typography>
        <Typography paragraph>
          Founded in 2023, Beshara has grown from a small startup to a leading
          e-commerce platform. Our mission is to provide customers with a
          seamless shopping experience, offering a wide range of high-quality
          products at competitive prices.
        </Typography>
        <Typography paragraph>
          We believe in building lasting relationships with our customers
          through transparency, reliability, and exceptional service. Our team
          is dedicated to continuously improving our platform and services to
          meet your needs.
        </Typography>
      </Card>

      {/* Features */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ p: 3, height: "100%", textAlign: "center" }}>
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography color="text.secondary">
                {feature.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Team Section */}
      <Typography variant="h4" align="center" gutterBottom>
        Our Team
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        paragraph
        sx={{ mb: 4 }}
      >
        Meet the people behind Beshara
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ p: 3, textAlign: "center" }}>
              <Avatar
                src={member.image}
                alt={member.name}
                sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                {member.name}
              </Typography>
              <Typography color="text.secondary">{member.role}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Values */}
      <Card sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Our Values
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Customer First
            </Typography>
            <Typography color="text.secondary">
              We prioritize customer satisfaction above all else, ensuring every
              interaction is positive and valuable.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quality Assurance
            </Typography>
            <Typography color="text.secondary">
              We maintain the highest standards of quality in our products and
              services.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Innovation
            </Typography>
            <Typography color="text.secondary">
              We continuously evolve and improve to provide the best shopping
              experience.
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
