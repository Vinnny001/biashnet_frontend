import { Alert, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Card from "../../components/common/Card";
import ProductForm from "../../components/forms/ProductForm";
import { productService } from "../../services/product.service";
import { getErrorMessage } from "../../utils/errors";

export default function AddProduct() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(values) {
    try {
      setError("");
      await productService.create(values);
      setMessage("Product created.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Add product</Typography>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Card><ProductForm onSubmit={handleSubmit} /></Card>
    </Stack>
  );
}
