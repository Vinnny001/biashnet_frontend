import { Button, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import ProductImage from "../../components/product/ProductImage";
import ProductReviews from "../../components/product/ProductReviews";
import { useCart } from "../../hooks/useCart";
import { productService } from "../../services/product.service";
import { formatCurrency } from "../../utils/formatters";

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([productService.get(id), productService.reviews(id)])
      .then(([productResult, reviewResult]) => {
        if (productResult.status === "fulfilled") {
          setProduct(productResult.value?.data || productResult.value);
        }
        if (reviewResult.status === "fulfilled") {
          setReviews(reviewResult.value?.data || reviewResult.value || []);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!product) return <Typography color="text.secondary">Product not found.</Typography>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <ProductImage src={product.image || product.imageUrl || product.images?.[0]} alt={product.name} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <Stack spacing={2}>
            <Typography variant="h4">{product.name || product.title}</Typography>
            <Typography variant="h5" color="primary.main">{formatCurrency(product.price)}</Typography>
            <Typography color="text.secondary">{product.description}</Typography>
            <Button variant="contained" onClick={() => addItem(product)}>Add to cart</Button>
          </Stack>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <ProductReviews reviews={reviews} />
      </Grid>
    </Grid>
  );
}
