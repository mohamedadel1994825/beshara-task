"use client";

import { getProductById, Product } from "@/services/api";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import AddToCartButton from "./AddToCartButton";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError("Failed to load product details. Please try again later.");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box p={3}>
        <Typography color="error">{error || "Product not found"}</Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/")}
          sx={{ mt: 2 }}
        >
          Return to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={product.image}
              alt={product.title}
              sx={{ objectFit: "contain", p: 2 }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.title}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price}
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Rating value={product.rating.rate} readOnly precision={0.5} />
            <Typography variant="body2" color="text.secondary" ml={1}>
              ({product.rating.count} reviews)
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Category: {product.category}
          </Typography>
          <AddToCartButton product={product} />
        </Grid>
      </Grid>
    </Box>
  );
}
