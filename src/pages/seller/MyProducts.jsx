import { useEffect, useState } from "react";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Loading from "../../components/common/Loading";
import ProductTable from "../../components/seller/ProductTable";
import { productService } from "../../services/product.service";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errors";

export default function MyProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      const sellerId = user?.id || user?.uid;

      if (!sellerId) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await productService.list({ sellerId });
        const data = response?.data?.data || response?.data || [];

        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [user]);

  async function handleDelete(id) {
    if (!window.confirm("Delete this product? This cannot be undone.")) {
      return;
    }

    try {
      setError("");
      await productService.remove(id);
      setProducts((current) => current.filter((product) => (product.id || product._id) !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">My products</Typography>
        <Button component={Link} to="/seller/products/new" variant="contained">Add product</Button>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Loading label="Loading your products..." />
      ) : (
        <ProductTable products={products} onDelete={handleDelete} />
      )}
    </Stack>
  );
}