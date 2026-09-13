import { useEffect, useState } from "react";
import { Alert, MenuItem, Stack, TextField, Typography } from "@mui/material";
import ProductTable from "../../components/admin/ProductTable";
import ReviewDecisionDialog from "../../components/admin/ReviewDecisionDialog";
import Loading from "../../components/common/Loading";
import { productService } from "../../services/product.service";
import { normalizeList } from "../../utils/helpers";
import { getErrorMessage } from "../../utils/errors";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending review" },
  { value: "approved", label: "Approved" },
  { value: "active", label: "Active" },
  { value: "rejected", label: "Rejected" },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // The approve / reject decision being confirmed: { product, status }.
  const [decision, setDecision] = useState(null);
  const [decisionError, setDecisionError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const payload = await productService.list(statusFilter ? { status: statusFilter } : {});
      setProducts(normalizeList(payload));
    } catch (err) {
      setError(getErrorMessage(err));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  function openDecision(productId, status) {
    const product = products.find((item) => (item.id || item._id) === productId);
    setDecisionError("");
    setDecision({ product: product || { id: productId }, status });
  }

  async function confirmDecision(note) {
    const { product, status } = decision;
    const productId = product.id || product._id;

    try {
      setBusyId(productId);
      setDecisionError("");
      setMessage("");

      const result = await productService.updateStatus(productId, status, note);

      const outcome = status === "approved" ? "Product approved — now live on the marketplace." : "Product rejected.";
      setMessage(
        result?.sellerNotified === false
          ? `${outcome} The seller couldn't be notified, so let them know directly.`
          : `${outcome} The seller has been notified.`
      );
      setDecision(null);
      loadProducts();
    } catch (err) {
      // Keep the dialog open with the note, so nothing typed is lost.
      setDecisionError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2} alignItems={{ sm: "center" }}>
        <Typography variant="h4">Products</Typography>
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {STATUS_FILTERS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {message && (
        <Alert severity="success" onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Loading />
      ) : (
        <ProductTable products={products} busyId={busyId} onModerate={openDecision} />
      )}

      {decision && (
        <ReviewDecisionDialog
          key={`${decision.product.id || decision.product._id}-${decision.status}`}
          product={decision.product}
          status={decision.status}
          busy={busyId !== null}
          error={decisionError}
          onCancel={() => setDecision(null)}
          onConfirm={confirmDecision}
        />
      )}
    </Stack>
  );
}
