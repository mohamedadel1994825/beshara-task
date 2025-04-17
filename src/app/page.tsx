"use client";

import CategoryAccordion from "@/components/products/CategoryAccordion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getCategories } from "@/services/api";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError("Failed to load categories. Please try again later.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAccordionChange = (category: string) => {
    setExpanded(expanded === category ? false : category);
  };

  return (
    <Box>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Product Categories
        </Typography>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            {categories.map((category) => (
              <CategoryAccordion
                key={category}
                category={category}
                expanded={expanded === category}
                onChange={handleAccordionChange}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
