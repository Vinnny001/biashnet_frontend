import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useRef } from "react";

import ProductGrid, { ProductGridSkeleton } from "./ProductGrid";

/*
 * `loading` is the first request — nothing on screen yet, so the grid itself
 * shows skeleton cards. `loadingMore` is another screenful being appended,
 * which belongs under what is already there. Conflating them put a row of
 * skeletons below an empty grid that was already showing skeletons.
 */
export default function InfiniteProductGrid({
  products = [],
  loading = false,
  loadingMore = false,
  error = null,
  onRetry,
  hasMore = false,
  onLoadMore,
}) {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!hasMore || loading || loadingMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: "500px 0px" }
    );

    const node = loaderRef.current;

    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, [loading, loadingMore, hasMore, onLoadMore]);

  return (
    <Box sx={{ width: "100%" }}>
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={onRetry}
      />

      {loadingMore && (
        <Box sx={{ px: { xs: 0.75, sm: 1.5, md: 2 }, mt: 1.5 }}>
          <ProductGridSkeleton count={4} />
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
        {hasMore && loadingMore && <CircularProgress size={24} />}

        {!hasMore && !loading && products.length > 0 && (
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
