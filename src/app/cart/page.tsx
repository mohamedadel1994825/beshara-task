"use client";

import { clearCart, removeItem, reorderItems } from "@/features/cart/cartSlice";
import { RootState } from "@/lib/store";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    dispatch(reorderItems(reorderedItems));
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeItem(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
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
            <Droppable droppableId="cart-items">
              {(provided) => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ mb: 2 }}
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
                                  >
                                    <DeleteIcon />
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
            <Button variant="outlined" color="error" onClick={handleClearCart}>
              Clear Cart
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
    </Box>
  );
};

export default CartPage;
