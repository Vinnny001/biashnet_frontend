import { useCallback, useEffect, useState } from "react";

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
  CheckCircleRounded,
  EditRounded,
  RefreshRounded,
} from "@mui/icons-material";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Loading from "../../components/common/Loading";
import ProductForm from "../../components/forms/ProductForm";

import { productService } from "../../services/product.service";
import { getErrorMessage } from "../../utils/errors";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setError("Product ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await productService.get(id);

      const data =
        response?.data?.data ||
        response?.data ||
        response;

      if (!data || typeof data !== "object") {
        throw new Error("Product could not be found.");
      }

      setProduct(data);
    } catch (err) {
      console.error(
        "Failed to load product:",
        err
      );

      setProduct(null);
      setError(
        getErrorMessage(err) ||
          "Failed to load product."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  async function handleSubmit(formData) {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      /*
       * ProductForm sends FormData.
       *
       * This allows:
       * - product fields
       * - existing images
       * - new image files
       *
       * to reach the backend in one request.
       */
      await productService.update(
        id,
        formData
      );

      setMessage(
        "Product updated successfully."
      );

      /*
       * Reload the product so the form reflects
       * the latest server state.
       */
      await fetchProduct();

      /*
       * Optional short scroll to top so the seller
       * immediately sees the success message.
       */
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Product update failed:",
        err
      );

      setError(
        getErrorMessage(err) ||
          "Failed to update product. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * ==============================
   * Loading
   * ==============================
   */

  if (loading) {
    return (
      <Box py={4}>
        <Loading label="Loading product..." />
      </Box>
    );
  }

  /*
   * ==============================
   * Product not found / error
   * ==============================
   */

  if (!product) {
    return (
      <Stack
        spacing={2}
        sx={{
          maxWidth: 700,
          mx: "auto",
          py: 4,
        }}
      >
        <Alert
          severity="error"
          sx={{ borderRadius: 2 }}
        >
          {error ||
            "This product could not be found."}
        </Alert>

        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            component={Link}
            to="/seller/products"
            startIcon={
              <ArrowBackRounded />
            }
          >
            Back to Products
          </Button>

          <Button
            onClick={fetchProduct}
            startIcon={
              <RefreshRounded />
            }
            variant="outlined"
          >
            Try Again
          </Button>
        </Stack>
      </Stack>
    );
  }

  const productName =
    product.title ||
    product.name ||
    "Product";

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      {/* =================================
          HEADER
      ================================== */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
      >
        <Box>
          <Button
            component={Link}
            to="/seller/products"
            startIcon={
              <ArrowBackRounded />
            }
            sx={{
              mb: 1,
              px: 0,
              fontWeight: 700,
              justifyContent: "flex-start",
            }}
          >
            Back to Products
          </Button>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <EditRounded color="primary" />

            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                fontSize: {
                  xs: "1.7rem",
                  md: "2.1rem",
                },
              }}
            >
              Edit Product
            </Typography>
          </Stack>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Update your listing information,
            pricing, stock and images.
          </Typography>
        </Box>

        <Button
          component={Link}
          to={`/products/${id}`}
          variant="outlined"
          startIcon={
            <CheckCircleRounded />
          }
          sx={{
            fontWeight: 700,
            alignSelf: {
              xs: "flex-start",
              sm: "center",
            },
          }}
        >
          View Product
        </Button>
      </Stack>

      {/* =================================
          SUCCESS
      ================================== */}

      {message && (
        <Alert
          severity="success"
          icon={
            <CheckCircleRounded />
          }
          onClose={() => setMessage("")}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          {message}
        </Alert>
      )}

      {/* =================================
          ERROR
      ================================== */}

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

      {/* =================================
          PRODUCT EDITOR
      ================================== */}

      <Card
        sx={{
          borderRadius: {
            xs: 2,
            md: 3,
          },
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            "&:last-child": {
              pb: {
                xs: 2,
                sm: 3,
                md: 4,
              },
            },
          }}
        >
          <ProductForm
            initialValues={product}
            onSubmit={handleSubmit}
            submitting={saving}
          />
        </CardContent>
      </Card>
    </Stack>
  );
}