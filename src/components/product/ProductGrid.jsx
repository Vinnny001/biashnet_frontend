import { Box, Typography } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [] }) {
  if (!products.length) {
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(100%, 165px), 1fr))",
          gap: { xs: 1, sm: 1.5, md: 2 },
          alignItems: "stretch",
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id || product._id}
            product={product}
          />
        ))}
      </Box>
    </Box>
  );
}