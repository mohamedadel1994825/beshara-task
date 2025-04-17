// src/components/cart/SortableCartItem.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartItem } from "@/types/cart";

interface SortableCartItemProps {
  item: CartItem;
  onRemove: (id: number) => void;
  onQuantityChange: (id: number, quantity: number) => void;
  removingItemId: number | null;
}

export const SortableCartItem: React.FC<SortableCartItemProps> = ({
  item,
  onRemove,
  onQuantityChange,
  removingItemId,
}) => {
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

export default SortableCartItem;