import { useCallback, useEffect, useState } from "react";

import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import ListingPolicyNote from "../../components/seller/ListingPolicyNote";

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

  /*
   * Changes waiting on the seller's confirmation, because this listing is
   * mid-review. Held rather than saved: see handleSubmit.
   */
  const [pendingChanges, setPendingChanges] = useState(null);

  const inReview = String(product?.status || "").toLowerCase() === "pending";

  /*
   * What the automatic check could not pass, when it was the check and not an
   * admin that held the listing back. Worth showing the seller: these are
   * specific and usually quick to fix, and they are why the listing is
   * waiting at all.
   */
  const flagged =
    product?.policyReview?.decision === "flag" && !product.policyReview.failed
      ? product.policyReview
      : null;

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

  /*
   * A listing that is already being reviewed is not edited silently. Saving
   * replaces the version that was submitted and starts the review over —
   * the one already under way is discarded, whatever it was about to decide
   * — so the seller confirms that before anything is sent.
   */
  async function handleSubmit(formData) {
    if (inReview) {
      setPendingChanges(formData);
      return;
    }

    await save(formData);
  }

  async function save(formData) {
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
      const result = await productService.update(
        id,
        formData
      );

      /*
       * Changing a reviewed listing's title, description, category,
       * condition or photos sends it back for admin review, which hides it
       * from buyers until it's approved. Say so, or the seller will think
       * their listing has simply vanished.
       */
      setMessage(
        result?.data?.sentForReview
          ? inReview
            ? "Changes saved. They've replaced the version that was being reviewed, and the review has started again — your listing stays hidden from buyers until it's approved."
            : "Changes saved. Because you changed how this listing looks, it's been sent for review and is hidden from buyers until it's approved."
          : "Product updated successfully."
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
          IN REVIEW — editing replaces the submission
      ================================== */}

      {inReview && (
        <Alert
          severity="warning"
          sx={{ borderRadius: 2 }}
        >
          <AlertTitle sx={{ fontWeight: 800 }}>
            This listing is being reviewed
          </AlertTitle>

          It's hidden from buyers until it's approved. You don't need to change
          anything while you wait — but if you save changes, they replace what
          you sent and the review starts again from the beginning.

          {flagged && (
            <Box sx={{ mt: 1.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                What our checks noticed
              </Typography>

              <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
                {flagged.reasons.map((reason, index) => (
                  <Box component="li" key={index} sx={{ mb: 0.4 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                      {reason.rule}
                    </Typography>
                    {reason.detail && (
                      <Typography sx={{ fontSize: 14 }}>
                        {reason.detail}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>

              <Typography
                sx={{ fontSize: 13, mt: 0.75, color: "text.secondary" }}
              >
                Our team still has the final say, so you may not need to change
                anything. Fixing these first usually gets a listing approved
                sooner.
              </Typography>
            </Box>
          )}
        </Alert>
      )}

      {/* =================================
          REJECTED — the admin's reason
      ================================== */}

      {product.status === "rejected" && (
        <Alert
          severity="error"
          sx={{ borderRadius: 2 }}
        >
          <strong>This listing wasn't approved.</strong>{" "}
          {product.reviewNote
            ? `Reason: ${product.reviewNote} `
            : ""}
          Fix the photos or text below and save to send it for review again.
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
          <ListingPolicyNote editing />

          <Box sx={{ mt: 2.5 }}>
            <ProductForm
              initialValues={product}
              onSubmit={handleSubmit}
              submitting={saving}
            />
          </Box>
        </CardContent>
      </Card>

      {/* =================================
          REPLACE WHAT'S UNDER REVIEW?
      ================================== */}

      <Dialog
        open={Boolean(pendingChanges)}
        onClose={saving ? undefined : () => setPendingChanges(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle fontWeight={800}>
          Replace the version being reviewed?
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            This listing is already being reviewed. Saving now replaces what
            you sent with what's on screen, and the review starts again — so
            it may take longer than if you wait.
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1.5 }}>
            It stays hidden from buyers either way until it's approved.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setPendingChanges(null)}
            disabled={saving}
          >
            Keep waiting
          </Button>

          <Button
            variant="contained"
            color="warning"
            disabled={saving}
            onClick={() => {
              const changes = pendingChanges;
              setPendingChanges(null);
              save(changes);
            }}
            sx={{ fontWeight: 700 }}
          >
            Replace and review again
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}