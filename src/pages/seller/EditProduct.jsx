import { Alert, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import ProductForm from "../../components/forms/ProductForm";
import { productService } from "../../services/product.service";
import { getErrorMessage } from "../../utils/errors";

export default function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    productService.get(id).then((payload) => setProduct(payload?.data || payload)).catch(() => setProduct({}));
  }, [id]);

  async function handleSubmit(values) {
    try {
      setError("");
      await productService.update(id, values);
      setMessage("Product updated.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  if (!product) return <Loading />;

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Edit product</Typography>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Card><ProductForm initialValues={product} onSubmit={handleSubmit} /></Card>
    </Stack>
  );
}
