import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

  const [subOrders, setSubOrders] = useState([]);

  const sellerId = user?.id || user?.uid;

  const fetchOrders = useCallback(async () => {
    if (!sellerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await orderService.list({
        sellerId,
      });

      const data = response?.orders || [];

      setOrders(
        Array.isArray(data) ? data : []
      );

      const subOrderPayload =
        await orderService.getMySubOrders();

      setSubOrders(
        Array.isArray(subOrderPayload?.subOrders)
          ? subOrderPayload.subOrders
          : []
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

  /*
   * Sellers no longer set order status directly — fulfillment
   * is logistics-managed now (drop items at Biashnet, the
   * logistics/supply-chain manager confirms receipt). There's
   * no backend endpoint for this anymore; keep the handler so
   * OrderTable's UI doesn't throw, but make the new flow clear.
   */
  function handleStatusChange() {
    setError(
      "Order status is now updated by Biashnet logistics once you drop off your item(s) — see your sub-order status below."
    );
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
          MY SUB-ORDERS (drop-off status)
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
          <Typography fontWeight={800} sx={{ mb: 1 }}>
            Drop-off status
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Deliver your item(s) to Biashnet within the window below — the logistics team
            confirms receipt there, not at the buyer's address.
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Drop-off deadline</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography color="text.secondary">
                        No sub-orders yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {subOrders.map((subOrder) => {
                  const deadline = subOrder.dropoffDeadline?._seconds
                    ? new Date(subOrder.dropoffDeadline._seconds * 1000)
                    : subOrder.dropoffDeadline
                    ? new Date(subOrder.dropoffDeadline)
                    : null;

                  const overdue =
                    subOrder.status === "PENDING_DROPOFF" &&
                    deadline &&
                    deadline.getTime() < Date.now();

                  const statusColor = {
                    PENDING_DROPOFF: overdue ? "error" : "warning",
                    AT_BIASHNET: "info",
                    NON_COMPLIANT: "error",
                    RELEASED: "success",
                    REFUNDED: "default",
                    CANCELLED: "default",
                  }[subOrder.status] || "default";

                  return (
                    <TableRow key={subOrder.subOrderId}>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                        {subOrder.orderId}
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={subOrder.status} color={statusColor} />
                      </TableCell>
                      <TableCell>
                        {deadline ? deadline.toLocaleString() : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

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