import { Grid, Typography } from "@mui/material";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [] }) {
  if (!products.length) {
    return <Typography color="text.secondary">No products found.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid item key={product.id || product._id} xs={12} sm={6} md={4} lg={3}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
