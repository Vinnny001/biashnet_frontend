import { Grid, Box, Typography } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [] }) {
  if (!products.length) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <ShoppingBagOutlinedIcon
          sx={{
            fontSize: 70,
            color: "text.disabled",
          }}
        />

        <Typography variant="h6" fontWeight={600}>
          No products found
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 320 }}
        >
          We couldn't find any products matching your search.
          Try another category or check back later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, py: 2 }}>
      <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, minmax(140px, 170px))",
      sm: "repeat(3, minmax(150px, 180px))",
      md: "repeat(4, minmax(170px, 190px))",
      lg: "repeat(5, minmax(180px, 200px))",
      xl: "repeat(6, minmax(180px, 200px))",
    },
    justifyContent: "center",
    gap: {
      xs: 1.5,
      sm: 2,
      md: 2.5,
    },
    px: {
      xs: 1,
      sm: 2,
      md: 3,
    },
    py: 2,
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