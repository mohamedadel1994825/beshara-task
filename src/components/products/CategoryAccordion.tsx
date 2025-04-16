import { addItem } from "@/features/cart/cartSlice";
import { getProductsByCategory, Product } from "@/services/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface CategoryAccordionProps {
  category: string;
  expanded: boolean;
  onChange: (category: string) => void;
}

const CategoryAccordion = ({
  category,
  expanded,
  onChange,
}: CategoryAccordionProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch products when accordion is expanded
  useEffect(() => {
    if (expanded) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const data = await getProductsByCategory(category);
          setProducts(data);
          setError(null);
        } catch (err) {
          setError(
            `Failed to load products for ${category}. Please try again later.`
          );
          console.error(`Error fetching products for ${category}:`, err);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    }
  }, [expanded, category]);

  const handleAddToCart = (product: Product) => {
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

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={() => onChange(category)}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ textTransform: "capitalize" }}>{category}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.title}
                    sx={{ objectFit: "contain", p: 1 }}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      noWrap
                    >
                      {product.title}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>
                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleProductClick(product.id)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default CategoryAccordion;
