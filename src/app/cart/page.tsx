"use client";

import {
  clearCart,
  removeItem,
  reorderItems,
  useClearCartMutation,
  useRemoveFromCartMutation,
} from "@/features/cart/cartSlice";
import { RootState } from "@/lib/store";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const [removeFromCart, { isLoading: isRemoving }] =
    useRemoveFromCartMutation();
  const [clearCartMutation, { isLoading: isClearing }] = useClearCartMutation();

  // State for item being removed
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);

  // Toast state
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    dispatch(reorderItems(reorderedItems));

    setToast({
      open: true,
      message: "Cart items reordered successfully",
      severity: "success",
    });
  };

  const handleRemoveItem = async (id: number) => {
    setRemovingItemId(id);
    try {
      // Try to use API in production
      if (process.env.NODE_ENV === "production") {
        await removeFromCart(id).unwrap();
      } else {
        // Use local state in development
        dispatch(removeItem(id));
      }

      setToast({
        open: true,
        message: "Item removed from cart",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to remove item:", error);
      setToast({
        open: true,
        message: "Failed to remove item. Please try again.",
        severity: "error",
      });
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      // Try to use API in production
      if (process.env.NODE_ENV === "production") {
        await clearCartMutation().unwrap();
      } else {
        // Use local state in development
        dispatch(clearCart());
      }

      setToast({
        open: true,
        message: "Cart cleared successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to clear cart:", error);
      setToast({
        open: true,
        message: "Failed to clear cart. Please try again.",
        severity: "error",
      });
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {items.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center", maxWidth: 600, mx: "auto" }}>
          <Box sx={{ mb: 3 }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: "text.secondary" }} />
          </Box>
          <Typography variant="h5" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Typography color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet. Start
            shopping to discover amazing products!
          </Typography>
          <Button
            component={Link}
            href="/"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Start Shopping
          </Button>
        </Card>
      ) : (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId="cart-items"
              isDropDisabled={false}
              isCombineEnabled={false}
            >
              {(provided, snapshot) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{
                    backgroundColor: snapshot.isDraggingOver
                      ? "rgba(0, 0, 0, 0.02)"
                      : "transparent",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                      isDragDisabled={false}
                    >
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            mb: 2,
                            transform: snapshot.isDragging
                              ? "scale(1.02)"
                              : "none",
                            transition: "transform 0.2s ease",
                            boxShadow: snapshot.isDragging ? 3 : 1,
                          }}
                        >
                          <CardContent>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={3}>
                                <CardMedia
                                  component="img"
                                  height="100"
                                  image={item.image}
                                  alt={item.title}
                                  sx={{ objectFit: "contain" }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="h6">
                                  {item.title}
                                </Typography>
                                <Typography color="primary">
                                  ${item.price} x {item.quantity}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography variant="h6" sx={{ mr: 2 }}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </Typography>
                                  <IconButton
                                    color="error"
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={removingItemId === item.id}
                                  >
                                    {removingItemId === item.id ? (
                                      <CircularProgress
                                        size={24}
                                        color="error"
                                      />
                                    ) : (
                                      <DeleteIcon />
                                    )}
                                  </IconButton>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearCart}
              disabled={isClearing}
              startIcon={
                isClearing && <CircularProgress size={20} color="error" />
              }
            >
              {isClearing ? "Clearing..." : "Clear Cart"}
            </Button>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h5" gutterBottom>
                Total: ${calculateTotal().toFixed(2)}
              </Typography>
              <Button variant="contained" color="primary">
                Checkout
              </Button>
            </Box>
          </Box>
        </>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartPage;
