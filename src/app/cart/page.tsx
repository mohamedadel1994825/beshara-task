"use client";

import {
  clearCart,
  removeItem,
  reorderItems,
  updateQuantity,
  useClearCartMutation,
  useRemoveFromCartMutation,
} from "@/features/cart/cartSlice";
import { RootState } from "@/lib/store";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
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
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Import dnd-kit components
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Cart Item Component
const SortableCartItem = ({ item, onRemove, onQuantityChange, removingItemId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        boxShadow: isDragging ? 3 : 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      {...attributes}
      {...listeners}
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
                borderRadius: 1,
                height: {
                  xs: "100px",
                  sm: "120px",
                  md: "140px",
                },
                "& img": {
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: 1,
                },
              }}
            >
              <img src={item.image} alt={item.title} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">{item.title}</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 1,
              }}
            >
              <IconButton
                size="small"
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                sx={{
                  border: "1px solid",
                  borderColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="body1"
                sx={{
                  minWidth: "24px",
                  textAlign: "center",
                }}
              >
                {item.quantity}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                sx={{
                  border: "1px solid",
                  borderColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography color="primary" sx={{ mt: 1 }}>
              ${item.price} each
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
                onClick={() => onRemove(item.id)}
                disabled={removingItemId === item.id}
              >
                {removingItemId === item.id ? (
                  <CircularProgress size={24} color="error" />
                ) : (
                  <DeleteIcon />
                )}
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const CartPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [clearCartMutation, { isLoading: isClearing }] = useClearCartMutation();

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance before drag starts (prevents accidental drags)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id.toString() === active.id);
      const newIndex = items.findIndex(item => item.id.toString() === over.id);
      
      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      
      dispatch(reorderItems(reorderedItems));

      setToast({
        open: true,
        message: "Cart items reordered successfully",
        severity: "success",
      });
    }
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

  const handleQuantityChange = async (id: number, newQuantity: number) => {
    try {
      if (process.env.NODE_ENV === "production") {
        // In production, we would call an API to update the quantity
        // For now, we'll just update the local state
        dispatch(updateQuantity({ id, quantity: newQuantity }));
      } else {
        dispatch(updateQuantity({ id, quantity: newQuantity }));
      }

      setToast({
        open: true,
        message: `Quantity updated to ${newQuantity}`,
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      setToast({
        open: true,
        message: "Failed to update quantity. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {items.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: { xs: 4, sm: 6, md: 8 },
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: { xs: 80, sm: 100, md: 120 },
              height: { xs: 80, sm: 100, md: 120 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "primary.light",
              borderRadius: "50%",
              mb: 3,
            }}
          >
            <ShoppingCartOutlinedIcon
              sx={{
                fontSize: { xs: 40, sm: 50, md: 60 },
                color: "primary.main",
              }}
            />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            Your Cart is Empty
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 4,
              maxWidth: "600px",
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
            }}
          >
            Looks like you haven't added any items to your cart yet. Start
            shopping to discover amazing products!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            href="/"
            startIcon={<ShoppingCartOutlinedIcon />}
            sx={{
              px: { xs: 3, sm: 4 },
              py: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
              borderRadius: 2,
              boxShadow: 2,
              "&:hover": {
                boxShadow: 4,
                backgroundColor: "primary.dark",
              },
            }}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        <>
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={items.map(item => item.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              <Box
                sx={{
                  transition: "background-color 0.2s ease",
                }}
              >
                {items.map((item) => (
                  <SortableCartItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onQuantityChange={handleQuantityChange}
                    removingItemId={removingItemId}
                  />
                ))}
              </Box>
            </SortableContext>
          </DndContext>

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
        <DialogActions
          sx={{
            p: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 2 },
            "& > *": {
              width: { xs: "100%", sm: "200px" },
              m: 0,
              p: 0,
              "&.MuiButton-root": {
                margin: 0,
              },
            },
          }}
        >
          <Button
            onClick={() => setOpenClearDialog(false)}
            color="primary"
            variant="outlined"
            sx={{
              py: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
              fontWeight: 500,
              margin: 0,
              padding: 0,
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
              py: { xs: 1.25, sm: 1.5 },
              fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
              fontWeight: 500,
              margin: 0,
              padding: 0,
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