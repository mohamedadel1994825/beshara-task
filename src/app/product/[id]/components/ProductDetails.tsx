"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetProductQuery } from "@/features/products/productsSlice";
import { Box, Card, Grid, Rating, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

export default function ProductDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: product, isLoading, error } = useGetProductQuery(id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error loading product details</Typography>
      </Box>
    );
  }

  if (!product) {
    router.push("/404");
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "background.paper",
                p: 2,
                minHeight: "400px",
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "contain",
                }}
              />
            </Box>
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
            <Rating value={product.rating?.rate} readOnly />
            <Typography variant="body2" color="text.secondary" ml={1}>
              ({product.rating?.count} reviews)
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <AddToCartButton product={product} />
        </Grid>
      </Grid>
    </Box>
  );
}
