import { useEffect, useState } from "react";
import { Alert, MenuItem, Stack, TextField, Typography } from "@mui/material";
import ProductTable from "../../components/admin/ProductTable";
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

  async function handleModerate(productId, status) {
    try {
      setBusyId(productId);
      setError("");
      await productService.updateStatus(productId, status);
      setMessage(status === "approved" ? "Product approved — now live on the marketplace." : "Product rejected.");
      loadProducts();
    } catch (err) {
      setError(getErrorMessage(err));
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
        <ProductTable products={products} busyId={busyId} onModerate={handleModerate} />
      )}
    </Stack>
  );
}
