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
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
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

  const [openClearDialog, setOpenClearDialog] = useState(false);

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
      if (process.env.NODE_ENV === "production") {
        await clearCartMutation().unwrap();
      } else {
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
    } finally {
      setOpenClearDialog(false);
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
        <Typography>Your cart is empty</Typography>
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
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "background.paper",
                                    p: 1,
                                    "& img": {
                                      width: "80px",
                                      height: "80px",
                                      objectFit: "contain",
                                    },
                                  }}
                                >
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      objectFit: "contain",
                                    }}
                                  />
                                </Box>
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

          {items.length > 0 && (
            <Box
              sx={{
                mt: 3,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: { xs: 2, sm: 3 },
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpenClearDialog(true)}
                disabled={isClearing}
                startIcon={<DeleteIcon />}
                sx={{
                  width: { xs: "100%", sm: "180px", md: "200px", lg: "220px" },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "error.light",
                    color: "white",
                  },
                }}
              >
                Clear Cart
              </Button>
              <Box
                sx={{
                  textAlign: { xs: "center", sm: "right" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontSize: {
                      xs: "1.25rem",
                      sm: "1.375rem",
                      md: "1.5rem",
                      lg: "1.75rem",
                    },
                    fontWeight: 600,
                    mb: { xs: 1, sm: 1.5 },
                  }}
                >
                  Total: ${calculateTotal().toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "220px",
                      md: "280px",
                      lg: "320px",
                    },
                    py: { xs: 1.5, sm: 1.75, md: 2 },
                    fontSize: {
                      xs: "0.9375rem",
                      sm: "1rem",
                      md: "1.125rem",
                      lg: "1.25rem",
                    },
                    fontWeight: 600,
                    boxShadow: 2,
                    "&:hover": {
                      backgroundColor: "primary.dark",
                      boxShadow: 4,
                    },
                  }}
                >
                  Checkout
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}

      {/* Clear Cart Confirmation Dialog */}
      <Dialog
        open={openClearDialog}
        onClose={() => setOpenClearDialog(false)}
        aria-labelledby="clear-cart-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="clear-cart-dialog-title">
          Clear Shopping Cart
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear your cart? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenClearDialog(false)}
            color="primary"
            variant="outlined"
            sx={{
              width: { xs: "100%", sm: "180px", md: "200px" },
              py: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
              fontWeight: 500,
              mb: { xs: 1, sm: 0 },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleClearCart}
            color="error"
            variant="contained"
            disabled={isClearing}
            startIcon={
              isClearing ? <CircularProgress size={20} /> : <DeleteIcon />
            }
            sx={{
              width: { xs: "100%", sm: "180px", md: "200px" },
              py: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
          >
            {isClearing ? "Clearing..." : "Clear Cart"}
          </Button>
        </DialogActions>
      </Dialog>

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
