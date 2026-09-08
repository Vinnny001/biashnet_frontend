import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBackRounded,
  StorefrontRounded,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

import ProductForm from "../../components/forms/ProductForm";
import { productService } from "../../services/product.service";
import { getErrorMessage } from "../../utils/errors";

export default function AddProduct() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(formData) {
    try {
      setError("");
      setMessage("");

      await productService.create(formData);

      setMessage(
        "Your product has been published successfully and is now available to buyers."
      );

      setFormKey((key) => key + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Create product failed:", err);
      setError(getErrorMessage(err));
    }
  }

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              component={Link}
              to="/seller/products"
              variant="text"
              startIcon={<ArrowBackRounded />}
              sx={{
                minWidth: 0,
                px: 0,
                fontWeight: 700,
              }}
            >
              Products
            </Button>
          </Stack>

          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              mt: 0.5,
              fontSize: { xs: "1.7rem", md: "2.1rem" },
            }}
          >
            Add Product
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Add your product and start reaching buyers on BIASHNET.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/seller/products"
          variant="outlined"
          startIcon={<StorefrontRounded />}
          sx={{
            fontWeight: 700,
            borderRadius: 2,
          }}
        >
          My Products
        </Button>
      </Stack>

      {/* Success */}
      {message && (
        <Alert
          severity="success"
          onClose={() => setMessage("")}
          sx={{
            borderRadius: 2,
          }}
        >
          {message}
        </Alert>
      )}

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      )}

      {/* Form */}
      <Card
        sx={{
          borderRadius: { xs: 2, md: 3 },
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          overflow: "visible",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1.5, sm: 2.5, md: 4 },
            "&:last-child": {
              pb: { xs: 1.5, sm: 2.5, md: 4 },
            },
          }}
        >
          <ProductForm
            key={formKey}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </Stack>
  );
}