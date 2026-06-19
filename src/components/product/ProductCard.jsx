import { Button, Card, CardActions, CardContent, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { formatCurrency, truncate } from "../../utils/formatters";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const id = product.id || product._id;

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <ProductImage src={product.image || product.imageUrl || product.images?.[0]} alt={product.name} />
      <CardContent sx={{ flex: 1 }}>
        <Stack spacing={1}>
          <Typography variant="h6">{product.name || product.title || "Untitled product"}</Typography>
          <Typography color="primary.main" fontWeight={700}>
            {formatCurrency(product.price)}
          </Typography>
          <Typography color="text.secondary">{truncate(product.description || "", 90)}</Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button component={Link} to={`/products/${id}`} variant="outlined" fullWidth>
          View
        </Button>
        <Button onClick={() => addItem(product)} variant="contained" fullWidth>
          Add
        </Button>
      </CardActions>
    </Card>
  );
}
