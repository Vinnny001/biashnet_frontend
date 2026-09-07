import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

import ProductGrid from "./ProductGrid";
import ProductSkeleton from "./ProductSkeleton";

export default function InfiniteProductGrid({
  products = [],
  loading = false,
  hasMore = false,
  onLoadMore,
}) {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!hasMore || loading || !onLoadMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: "500px 0px" }
    );

    const node = loaderRef.current;

    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, [loading, hasMore, onLoadMore]);

  return (
    <Box sx={{ width: "100%" }}>
      <ProductGrid products={products} />

      {loading && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
              lg: "repeat(5, minmax(0, 1fr))",
            },
            gap: { xs: 1, sm: 1.5, md: 2 },
            mt: 1.5,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </Box>
      )}

      <Box
        ref={loaderRef}
        sx={{
          minHeight: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {hasMore && loading && <CircularProgress size={24} />}

        {!hasMore && products.length > 0 && (
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
              py: 2,
            }}
          >
            You've reached the end
          </Typography>
        )}
      </Box>
    </Box>
  );
}