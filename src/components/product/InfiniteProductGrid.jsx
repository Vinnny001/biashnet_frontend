import { Box, CircularProgress } from "@mui/material";
import { useEffect, useRef } from "react";

import ProductGrid from "./ProductGrid";
import ProductSkeleton from "./ProductSkeleton";

export default function InfiniteProductGrid({
  products = [],
  loading = false,
  hasMore = true,
  onLoadMore,
}) {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore?.();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, onLoadMore]);

  return (
    <>
      <ProductGrid products={products} />

      {loading && (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: 2,
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductSkeleton
              key={index}
              count={1}
            />
          ))}
        </Box>
      )}

      <Box
        ref={loaderRef}
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 4,
        }}
      >
        {hasMore && !loading && (
          <CircularProgress size={28} />
        )}
      </Box>
    </>
  );
}