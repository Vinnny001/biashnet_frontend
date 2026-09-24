import { Box, Button, Typography } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

/*
 * Two across on a phone, always. Asking for 165px-wide columns
 * left one product per row instead: the layout's padding and
 * the page's own leave about 300px on a 360px screen, so a
 * second column never fit and each card went full width.
 */
const COLUMNS_SX = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(2, minmax(0, 1fr))",
    sm: "repeat(auto-fill, minmax(min(100%, 190px), 1fr))",
  },
  gap: { xs: 1, sm: 1.5, md: 2 },
  alignItems: "stretch",
};

/*
 * Cards in the shape the real ones will take, so nothing shifts when they
 * arrive. Shared with InfiniteProductGrid, which shows a few more of these
 * under the grid as you scroll.
 */
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <Box sx={COLUMNS_SX}>
      {Array.from({ length: count }, (_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </Box>
  );
}

/*
 * `loading` and `error` are not decoration: without them an empty list is
 * ambiguous, and this grid used to resolve that ambiguity the worst possible
 * way — announcing "No products found" over a marketplace that had not
 * answered yet. Only a request that came back empty may say that.
 */
export default function ProductGrid({
  products = [],
  loading = false,
  error = null,
  errorTitle = "Couldn't load products",
  onRetry,
  skeletonCount = 8,
}) {
  let content;

  if (!products.length && loading) {
    content = <ProductGridSkeleton count={skeletonCount} />;
  } else if (!products.length && error) {
    content = (
      <Unreachable
        title={errorTitle}
        message={error}
        onRetry={onRetry}
      />
    );
  } else if (!products.length) {
    content = <Empty />;
  } else {
    content = (
      <Box sx={COLUMNS_SX}>
        {products.map((product) => (
          <ProductCard
            key={product.id || product._id}
            product={product}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 0.75, sm: 1.5, md: 2 },
        py: 1,
      }}
    >
      {content}
    </Box>
  );
}

function Empty() {
  return (
    <Box sx={{ py: 8, textAlign: "center" }}>
      <ShoppingBagOutlinedIcon
        sx={{ fontSize: 60, color: "text.disabled", mb: 1 }}
      />

      <Typography fontWeight={700}>
        No products found
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 0.5 }}
      >
        Try another search or category.
      </Typography>
    </Box>
  );
}

function Unreachable({ title, message, onRetry }) {
  return (
    <Box sx={{ py: 8, textAlign: "center" }}>
      <CloudOffRoundedIcon
        sx={{ fontSize: 60, color: "text.disabled", mb: 1 }}
      />

      <Typography fontWeight={700}>
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 0.5, mx: "auto", maxWidth: 380 }}
      >
        {message}
      </Typography>

      {onRetry && (
        <Button
          variant="contained"
          startIcon={<RefreshRoundedIcon />}
          onClick={onRetry}
          sx={{ mt: 2, fontWeight: 800 }}
        >
          Try again
        </Button>
      )}
    </Box>
  );
}
