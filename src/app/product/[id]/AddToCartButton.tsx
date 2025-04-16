"use client";

import { addItem } from "@/features/cart/cartSlice";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  rating?: {
    rate: number;
    count: number;
  };
}

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleAddToCart}
      fullWidth
    >
      Add to Cart
    </Button>
  );
}
