"use client";

import { addItem } from "@/features/cart/cartSlice";
import { RootState } from "@/lib/store";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LoginIcon from "@mui/icons-material/Login";
import {
  Alert,
  Box,
  Button,
  Fade,
  Snackbar,
  Typography,
  Zoom,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isAdding, setIsAdding] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Animation states
  const [animationActive, setAnimationActive] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Check if product is already in cart
  const isInCart = cartItems.some((item) => item.id === product.id);

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // Save product info to session storage for redirect back
      sessionStorage.setItem(
        "pendingCartItem",
        JSON.stringify({
          productId: product.id,
          pathname: window.location.pathname,
        })
      );
      toast.info("Please login to add items to cart");
      setIsRedirecting(true);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }

    if (isInCart) {
      return; // Don't add if already in cart
    }

    setIsAdding(true);
    dispatch(
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );

    toast.success("Item added to cart!");

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  useEffect(() => {
    if (isRedirecting) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isRedirecting, router]);

  const animateAddToCart = () => {
    // Get navbar cart icon position
    const cartIcon = document.querySelector(
      ".MuiSvgIcon-root[data-testid='ShoppingCartIcon']"
    );
    if (!cartIcon || !buttonRef.current) return;

    const startRect = buttonRef.current.getBoundingClientRect();
    const endRect = cartIcon.getBoundingClientRect();

    // Create animated element
    const animatedElement = document.createElement("div");
    animatedElement.style.position = "fixed";
    animatedElement.style.zIndex = "9999";
    animatedElement.style.left = `${startRect.left + startRect.width / 2}px`;
    animatedElement.style.top = `${startRect.top + startRect.height / 2}px`;
    animatedElement.style.transform = "translate(-50%, -50%)";
    animatedElement.style.transition =
      "all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)";
    animatedElement.style.opacity = "1";
    animatedElement.style.pointerEvents = "none";

    // Create icon in the animated element
    const icon = document.createElement("div");
    icon.innerHTML = `
      <svg style="width: 30px; height: 30px; color: #2196f3; background: white; border-radius: 50%; padding: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);" viewBox="0 0 24 24">
        <path fill="currentColor" d="M11,9H13V6H16V4H13V1H11V4H8V6H11V9M7,18A2,2 0 0,0 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20A2,2 0 0,0 7,18M17,18A2,2 0 0,0 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20A2,2 0 0,0 17,18M7.17,14.75L7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.59 17.3,11.97L21.16,4.96L19.42,4H19.41L18.31,6L15.55,11H8.53L8.4,10.73L6.16,6L5.21,4L4.27,2H1V4H3L6.6,11.59L5.25,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42C7.29,15 7.17,14.89 7.17,14.75Z" />
      </svg>
    `;
    animatedElement.appendChild(icon);
    document.body.appendChild(animatedElement);

    setAnimationActive(true);

    // Trigger animation
    setTimeout(() => {
      animatedElement.style.left = `${endRect.left + endRect.width / 2}px`;
      animatedElement.style.top = `${endRect.top + endRect.height / 2}px`;
      animatedElement.style.transform = "translate(-50%, -50%) scale(0.3)";
      animatedElement.style.opacity = "0";
    }, 50);

    // Remove element after animation
    setTimeout(() => {
      document.body.removeChild(animatedElement);
      setAnimationActive(false);
      setAnimationComplete(true);
    }, 800);
  };

  return (
    <>
      <Button
        ref={buttonRef}
        variant="contained"
        color={isInCart ? "success" : "primary"}
        onClick={handleAddToCart}
        disabled={isAdding || isRedirecting || isInCart}
        fullWidth
        size="large"
        startIcon={
          isRedirecting ? (
            <LoginIcon />
          ) : isInCart ? (
            <CheckCircleIcon />
          ) : (
            <AddShoppingCartIcon />
          )
        }
        sx={{
          mt: 2,
          transition: "all 0.3s ease",
          transform: isAdding ? "scale(0.95)" : "scale(1)",
          opacity: isAdding ? 0.7 : 1,
          "& .MuiButton-startIcon": {
            transition: "transform 0.3s ease",
            transform: isAdding ? "scale(1.2)" : "scale(1)",
          },
        }}
      >
        {isRedirecting
          ? "Redirecting to login..."
          : isInCart
          ? "Added to Cart"
          : isAdding
          ? "Adding..."
          : "Add to Cart"}
      </Button>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: "100%",
            alignItems: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
          icon={
            toast.severity === "success" ? (
              <Zoom in={true} timeout={300}>
                <CheckCircleIcon />
              </Zoom>
            ) : undefined
          }
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {toast.severity === "success" && (
              <Zoom in={true} timeout={300}>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: "30px",
                    height: "30px",
                    objectFit: "contain",
                    background: "white",
                    borderRadius: "4px",
                  }}
                />
              </Zoom>
            )}
            <Typography variant="body2">{toast.message}</Typography>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
}
