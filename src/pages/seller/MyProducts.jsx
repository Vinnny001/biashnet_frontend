import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  AddRounded,
  Inventory2Rounded,
  RefreshRounded,
  SearchRounded,
} from "@mui/icons-material";

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

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  const fetchProducts = useCallback(async () => {
    const sellerId = user?.id || user?.uid;

    if (!sellerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await productService.list({
        sellerId,
      });

      const data =
        response?.data?.data ||
        response?.data ||
        [];

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load seller products:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete this product?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await productService.remove(id);

      setProducts((current) =>
        current.filter(
          (product) =>
            (product.id || product._id) !== id
        )
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const name = (
        product.title ||
        product.name ||
        ""
      ).toLowerCase();

      const productCategory = (
        product.category || ""
      ).toLowerCase();

      const productStatus = (
        product.status || "pending"
      ).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        productCategory.includes(query);

      const matchesStatus =
        status === "all" ||
        productStatus === status;

      const matchesCategory =
        category === "all" ||
        productCategory === category.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    products,
    search,
    status,
    category,
  ]);

  const activeCount = products.filter(
    (product) =>
      product.status === "active" ||
      product.status === "approved"
  ).length;

  const pendingCount = products.filter(
    (product) => product.status === "pending"
  ).length;

  const rejectedCount = products.filter(
    (product) => product.status === "rejected"
  ).length;

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <Inventory2Rounded color="primary" />

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
              My Products
            </Typography>
          </Stack>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage your listings, stock and product
            visibility.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="outlined"
            onClick={fetchProducts}
            startIcon={<RefreshRounded />}
            sx={{
              fontWeight: 700,
              flex: { xs: 1, sm: "initial" },
            }}
          >
            Refresh
          </Button>

          <Button
            component={Link}
            to="/seller/products/new"
            variant="contained"
            startIcon={<AddRounded />}
            sx={{
              fontWeight: 800,
              flex: { xs: 1, sm: "initial" },
            }}
          >
            Add Product
          </Button>
        </Stack>
      </Stack>

      {/* Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(4, 1fr)",
          },
          gap: 1.5,
        }}
      >
        <MiniStat
          label="Total"
          value={products.length}
        />

        <MiniStat
          label="Active"
          value={activeCount}
          color="success.main"
        />

        <MiniStat
          label="Pending"
          value={pendingCount}
          color="warning.main"
        />

        <MiniStat
          label="Rejected"
          value={rejectedCount}
          color="error.main"
        />
      </Box>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card
        sx={{
          borderRadius: 2.5,
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={1.5}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Search your products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl
              size="small"
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 160,
                },
              }}
            >
              <InputLabel>Status</InputLabel>

              <Select
                value={status}
                label="Status"
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
                <MenuItem value="all">
                  All statuses
                </MenuItem>

                <MenuItem value="active">
                  Active
                </MenuItem>

                <MenuItem value="approved">
                  Approved
                </MenuItem>

                <MenuItem value="pending">
                  Pending
                </MenuItem>

                <MenuItem value="rejected">
                  Rejected
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 180,
                },
              }}
            >
              <InputLabel>Category</InputLabel>

              <Select
                value={category}
                label="Category"
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                {categories.map((item) => (
                  <MenuItem
                    key={item}
                    value={item}
                  >
                    {item === "all"
                      ? "All categories"
                      : item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* Result count */}
      {!loading && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Showing{" "}
            <strong>
              {filteredProducts.length}
            </strong>{" "}
            of{" "}
            <strong>{products.length}</strong>{" "}
            products
          </Typography>

          {search ||
          status !== "all" ||
          category !== "all" ? (
            <Button
              size="small"
              onClick={() => {
                setSearch("");
                setStatus("all");
                setCategory("all");
              }}
            >
              Clear filters
            </Button>
          ) : null}
        </Stack>
      )}

      {/* Products */}
      {loading ? (
        <Loading label="Loading your products..." />
      ) : (
        <ProductTable
          products={filteredProducts}
          onDelete={handleDelete}
        />
      )}
    </Stack>
  );
}

function MiniStat({
  label,
  value,
  color = "primary.main",
}) {
  return (
    <Card
      sx={{
        borderRadius: 2.5,
        boxShadow: "none",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {label}
        </Typography>

        <Typography
          variant="h5"
          fontWeight={900}
          sx={{ color }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}