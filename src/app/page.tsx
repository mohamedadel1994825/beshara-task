"use client";

import CategoryAccordion from "@/components/products/CategoryAccordion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useGetCategoriesQuery } from "@/services/productsApi"; // Assuming you have this query hook
import { Box, Typography } from "@mui/material";
import { useState } from "react";

export default function HomePage() {
  const { data: categories, error, isLoading } = useGetCategoriesQuery(); // Using RTK query hook for fetching categories
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange = (category: string) => {
    setExpanded(expanded === category ? false : category);
  };

  return (
    <Box>
      <Box sx={{ p: 3 }}>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <Typography color="error">{`Failed to load categories. Please try again later.`}</Typography>
        ) : (
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            {categories?.map((category) => (
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
