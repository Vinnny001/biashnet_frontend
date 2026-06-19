import { Stack } from "@mui/material";
import ProductCard from "./ProductCard";

export default function ProductList({ products = [] }) {
  return (
    <Stack spacing={2}>
      {products.map((product) => (
        <ProductCard key={product.id || product._id} product={product} />
      ))}
    </Stack>
  );
}
