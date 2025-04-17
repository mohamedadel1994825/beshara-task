import AddToCartButton from "@/app/product/[id]/components/AddToCartButton";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={() => onChange(category)}
      sx={{ mb: 2 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{category}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      height: "200px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 2,
                      bgcolor: "background.paper",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.title}
                      sx={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
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
                    <Box
                      sx={{
                        display: "flex",
                        gap: { xs: 1, sm: 2 },
                        mt: { xs: 1, sm: 2 },
                        flexDirection: { xs: "column", sm: "row" },
                        width: "100%",
                        alignItems: "stretch",
                      }}
                    >
                      <AddToCartButton
                        product={product}
                        sx={{
                          width: { xs: "100%", sm: "45%" },
                          py: { xs: 1, sm: 1.25 },
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                            md: "1rem",
                          },
                          height: { xs: "36px", sm: "40px" },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                      <Button
                        variant="outlined"
                        color="primary"
                        component={Link}
                        href={`/product/${product.id}`}
                        sx={{
                          width: { xs: "100%", sm: "55%" },
                          py: { xs: 1, sm: 1.25 },
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                            md: "1rem",
                          },
                          height: { xs: "36px", sm: "40px" },
                          whiteSpace: "nowrap",
                          minWidth: { xs: "120px", sm: "140px" },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
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
