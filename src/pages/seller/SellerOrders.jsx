import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  CheckCircleRounded,
  Inventory2Rounded,
  LocalShippingRounded,
  PendingActionsRounded,
  RefreshRounded,
  SearchRounded,
  ShoppingBagRounded,
} from "@mui/icons-material";

import Loading from "../../components/common/Loading";
import OrderTable from "../../components/seller/OrderTable";

import { orderService } from "../../services/order.service";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errors";

export default function SellerOrders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const sellerId = user?.id || user?.uid;

  const fetchOrders = useCallback(async () => {
    if (!sellerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      /*
       * Eventually this should preferably become:
       *
       * orderService.list({ sellerId })
       *
       * with the backend enforcing seller ownership.
       */
      const response = await orderService.list({
        sellerId,
      });

      const data =
        response?.data?.data ||
        response?.data ||
        [];

      setOrders(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Failed to load seller orders:",
        err
      );

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function handleStatusChange(
    orderId,
    newStatus
  ) {
    try {
      setError("");

      await orderService.update(
        orderId,
        {
          status: newStatus,
          orderStatus: newStatus,
        }
      );

      setOrders((current) =>
        current.map((order) =>
          (order.id || order._id) === orderId
            ? {
                ...order,
                status: newStatus,
                orderStatus: newStatus,
              }
            : order
        )
      );
    } catch (err) {
      console.error(
        "Failed to update order:",
        err
      );

      setError(getErrorMessage(err));
    }
  }

  const filteredOrders = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return orders.filter((order) => {
      const id = String(
        order.id || order._id || ""
      ).toLowerCase();

      const customer = String(
        order.customerName ||
          order.buyerName ||
          order.customer?.name ||
          "Customer"
      ).toLowerCase();

      const status = String(
        order.orderStatus ||
          order.status ||
          "pending"
      ).toLowerCase();

      const matchesSearch =
        !query ||
        id.includes(query) ||
        customer.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    search,
    statusFilter,
  ]);

  const statistics = useMemo(() => {
    const result = {
      total: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
    };

    orders.forEach((order) => {
      const status =
        order.orderStatus ||
        order.status ||
        "pending";

      if (result[status] !== undefined) {
        result[status]++;
      }
    });

    return result;
  }, [orders]);

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      {/* =============================
          PAGE HEADER
      ============================== */}

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
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <ShoppingBagRounded color="primary" />

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
              Orders
            </Typography>
          </Stack>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Manage customer orders and update
            delivery progress.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={
            <RefreshRounded />
          }
          onClick={fetchOrders}
          sx={{
            fontWeight: 700,
            alignSelf: {
              xs: "flex-start",
              sm: "center",
            },
          }}
        >
          Refresh
        </Button>
      </Stack>

      {/* =============================
          ERROR
      ============================== */}

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* =============================
          ORDER STATS
      ============================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 1.5,
        }}
      >
        <OrderStat
          label="Total Orders"
          value={statistics.total}
          icon={
            <ShoppingBagRounded />
          }
        />

        <OrderStat
          label="Pending"
          value={statistics.pending}
          icon={
            <PendingActionsRounded />
          }
          color="warning.main"
        />

        <OrderStat
          label="Processing"
          value={statistics.processing}
          icon={
            <Inventory2Rounded />
          }
          color="info.main"
        />

        <OrderStat
          label="Shipped"
          value={statistics.shipped}
          icon={
            <LocalShippingRounded />
          }
          color="primary.main"
        />

        <OrderStat
          label="Delivered"
          value={statistics.delivered}
          icon={
            <CheckCircleRounded />
          }
          color="success.main"
        />
      </Box>

      {/* =============================
          SEARCH + FILTER
      ============================== */}

      <Card
        sx={{
          borderRadius: 2.5,
          boxShadow: "none",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Stack spacing={1.5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by order ID or customer..."
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

            <Stack
              direction="row"
              spacing={1}
              sx={{
                overflowX: "auto",
                pb: 0.5,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {[
                ["all", "All"],
                ["pending", "Pending"],
                ["processing", "Processing"],
                ["shipped", "Shipped"],
                ["delivered", "Delivered"],
                ["cancelled", "Cancelled"],
              ].map(([value, label]) => (
                <Button
                  key={value}
                  size="small"
                  variant={
                    statusFilter === value
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() =>
                    setStatusFilter(value)
                  }
                  sx={{
                    borderRadius: 5,
                    whiteSpace: "nowrap",
                    fontWeight: 700,
                  }}
                >
                  {label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* =============================
          RESULTS
      ============================== */}

      {!loading && (
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Showing{" "}
          <strong>
            {filteredOrders.length}
          </strong>{" "}
          of{" "}
          <strong>{orders.length}</strong>{" "}
          orders
        </Typography>
      )}

      {/* =============================
          ORDER LIST
      ============================== */}

      {loading ? (
        <Loading label="Loading orders..." />
      ) : (
        <OrderTable
          orders={filteredOrders}
          sellerId={sellerId}
          onStatusChange={
            handleStatusChange
          }
        />
      )}
    </Stack>
  );
}

function OrderStat({
  label,
  value,
  icon,
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
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {label}
            </Typography>

            <Typography
              variant="h5"
              fontWeight={900}
              sx={{ mt: 0.25 }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              color,
              display: "flex",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}