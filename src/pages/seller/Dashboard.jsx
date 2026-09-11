import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  AddRounded,
  ArrowForwardRounded,
  Inventory2Rounded,
  ShoppingBagRounded,
  PaymentsRounded,
  AccountBalanceWalletRounded,
  TrendingUpRounded,
  WarningAmberRounded,
  LocalShippingRounded,
  CheckCircleRounded,
  AccessTimeRounded,
  RefreshRounded,
} from "@mui/icons-material";

import { Link } from "react-router-dom";

import Loading from "../../components/common/Loading";

import { sellerService } from "../../services/seller.service";
import { getErrorMessage } from "../../utils/errors";
import { toDate } from "../../utils/formatters";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PROFILE_FIELDS = ["name", "phone", "email", "bio", "location", "photoURL"];

function formatCurrency(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

/*
 * An order carries two independent states: `status` is the fulfillment
 * lifecycle and `paymentStatus` is whether the buyer's money actually
 * arrived. The seller cares about the combination, so flatten them into
 * the one label shown on the row.
 */
function orderLabel(order) {
  const status = String(order.status || "").toUpperCase();
  const paid = String(order.paymentStatus || "").toUpperCase() === "SUCCESSFUL";

  if (status === "COMPLETED") return "Completed";
  if (status === "CANCELLED") return "Cancelled";
  if (!paid) return "Awaiting payment";

  const payout = String(order.payoutStatus || "").toUpperCase();
  if (payout === "COMPLETED") return "Paid out";

  return "Paid";
}

/*
 * Sales for the last seven days, built from the orders the API actually
 * returned. Only money the seller is entitled to counts (sellerNet, after
 * commission) and only once the buyer has paid — an unpaid order is not a
 * sale. There is no per-day sales endpoint, so this is derived client-side.
 */
function buildWeeklySales(orders) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);

    days.push({
      label: DAY_LABELS[day.getDay()],
      time: day.getTime(),
      value: 0,
    });
  }

  const windowStart = days[0].time;

  for (const order of orders) {
    if (String(order.paymentStatus || "").toUpperCase() !== "SUCCESSFUL") continue;

    const placed = toDate(order.createdAt);
    if (!placed) continue;

    placed.setHours(0, 0, 0, 0);
    if (placed.getTime() < windowStart) continue;

    const day = days.find((entry) => entry.time === placed.getTime());
    if (day) day.value += Number(order.sellerNet || 0);
  }

  return days;
}

function StatCard({ label, value, change, icon: Icon }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {label}
            </Typography>

            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ wordBreak: "break-word" }}
            >
              {value}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.75 }}
            >
              {change}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              flexShrink: 0,
            }}
          >
            <Icon />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SectionHeader({ title, action, to }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: 2 }}
    >
      <Typography variant="h6" fontWeight={800}>
        {title}
      </Typography>

      {action && (
        <Button
          component={to ? Link : "button"}
          to={to}
          size="small"
          endIcon={<ArrowForwardRounded />}
          sx={{ fontWeight: 700 }}
        >
          {action}
        </Button>
      )}
    </Stack>
  );
}

function StatusChip({ status }) {
  const config = {
    "Awaiting payment": {
      color: "warning",
      icon: <AccessTimeRounded sx={{ fontSize: 15 }} />,
    },
    Paid: {
      color: "info",
      icon: <PaymentsRounded sx={{ fontSize: 15 }} />,
    },
    "Paid out": {
      color: "success",
      icon: <AccountBalanceWalletRounded sx={{ fontSize: 15 }} />,
    },
    Completed: {
      color: "success",
      icon: <CheckCircleRounded sx={{ fontSize: 15 }} />,
    },
    Cancelled: {
      color: "default",
      icon: <WarningAmberRounded sx={{ fontSize: 15 }} />,
    },
  };

  const item = config[status] || config["Awaiting payment"];

  return (
    <Chip
      size="small"
      color={item.color}
      icon={item.icon}
      label={status}
      variant="outlined"
    />
  );
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * The wallet is a separate call and a separate concern — if it
       * fails the rest of the dashboard is still worth showing, so it
       * is settled independently rather than failing the whole page.
       */
      const [dashboardResult, walletResult] = await Promise.allSettled([
        sellerService.dashboard(),
        sellerService.wallet(),
      ]);

      if (dashboardResult.status === "rejected") {
        throw dashboardResult.reason;
      }

      setDashboard(dashboardResult.value || null);

      setWallet(
        walletResult.status === "fulfilled"
          ? walletResult.value?.wallet || null
          : null
      );
    } catch (err) {
      console.error("Failed to load seller dashboard:", err);
      setError(getErrorMessage(err, "Could not load your dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const statistics = dashboard?.statistics || {};
  const shop = dashboard?.shop || null;

  const recentOrders = useMemo(
    () => (Array.isArray(dashboard?.recentOrders) ? dashboard.recentOrders : []),
    [dashboard]
  );

  const recentProducts = useMemo(
    () =>
      Array.isArray(dashboard?.recentProducts)
        ? dashboard.recentProducts.slice(0, 6)
        : [],
    [dashboard]
  );

  const salesData = useMemo(
    () => buildWeeklySales(recentOrders),
    [recentOrders]
  );

  const weekTotal = useMemo(
    () => salesData.reduce((total, day) => total + day.value, 0),
    [salesData]
  );

  const maxSale = useMemo(
    () => Math.max(...salesData.map((item) => item.value), 1),
    [salesData]
  );

  /*
   * Completion is measured against the shop fields a buyer actually
   * sees on a listing, so the number means something rather than
   * being decorative.
   */
  const profileCompletion = useMemo(() => {
    if (!shop) return 0;

    const filled = PROFILE_FIELDS.filter(
      (field) => String(shop[field] || "").trim().length > 0
    ).length;

    return Math.round((filled / PROFILE_FIELDS.length) * 100);
  }, [shop]);

  const stats = [
    {
      label: "Active Listings",
      value: String(statistics.activeProducts ?? 0),
      change: `${statistics.totalProducts ?? 0} total · ${
        statistics.totalStock ?? 0
      } in stock`,
      icon: Inventory2Rounded,
    },
    {
      label: "Total Orders",
      value: String(statistics.totalOrders ?? 0),
      change: `${statistics.paidOrders ?? 0} paid · ${
        statistics.completedOrders ?? 0
      } completed`,
      icon: ShoppingBagRounded,
    },
    {
      label: "Earnings",
      value: formatCurrency(statistics.sellerNet),
      change: `${formatCurrency(statistics.grossSales)} gross · ${formatCurrency(
        statistics.commission
      )} commission`,
      icon: PaymentsRounded,
    },
    {
      label: "Wallet Balance",
      value: formatCurrency(wallet?.availableBalance),
      change: wallet
        ? `${formatCurrency(wallet.pendingBalance)} held in escrow`
        : "Wallet unavailable",
      icon: AccountBalanceWalletRounded,
    },
  ];

  const orderStats = [
    {
      label: "Awaiting payment",
      value: statistics.pendingOrders ?? 0,
      icon: AccessTimeRounded,
    },
    {
      label: "Paid",
      value: statistics.paidOrders ?? 0,
      icon: PaymentsRounded,
    },
    {
      label: "Completed",
      value: statistics.completedOrders ?? 0,
      icon: CheckCircleRounded,
    },
    {
      label: "To deliver to store",
      value: Math.max(
        (statistics.paidOrders ?? 0) - (statistics.completedOrders ?? 0),
        0
      ),
      icon: LocalShippingRounded,
    },
  ];

  if (loading) {
    return <Loading label="Loading your dashboard" />;
  }

  return (
    <Stack spacing={3}>
      {error && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshRounded />}
              onClick={load}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Welcome */}
      <Box
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 3,
          color: "primary.contrastText",
          bgcolor: "primary.main",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{ fontSize: { xs: "1.7rem", md: "2.1rem" } }}
            >
              {shop?.name || "Seller Dashboard"}
            </Typography>

            <Typography
              sx={{
                mt: 0.75,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Manage your shop, products, orders and sales.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/seller/products/new"
            variant="contained"
            startIcon={<AddRounded />}
            sx={{
              bgcolor: "#fff",
              color: "primary.main",
              fontWeight: 800,
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            Add Product
          </Button>
        </Stack>
      </Box>

      {/* Statistics */}
      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.label}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Quick actions */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <SectionHeader title="Quick Actions" />

          <Grid container spacing={1.5}>
            <Grid item xs={6} sm={3}>
              <Button
                component={Link}
                to="/seller/products/new"
                fullWidth
                variant="contained"
                startIcon={<AddRounded />}
                sx={{
                  py: 1.4,
                  fontWeight: 800,
                  borderRadius: 2,
                }}
              >
                Add Product
              </Button>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Button
                component={Link}
                to="/seller/wallet"
                fullWidth
                variant="outlined"
                startIcon={<AccountBalanceWalletRounded />}
                sx={{
                  py: 1.4,
                  fontWeight: 800,
                  borderRadius: 2,
                }}
              >
                Withdraw
              </Button>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Button
                component={Link}
                to="/seller/orders"
                fullWidth
                variant="outlined"
                startIcon={<ShoppingBagRounded />}
                sx={{
                  py: 1.4,
                  fontWeight: 800,
                  borderRadius: 2,
                }}
              >
                Orders
              </Button>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Button
                component={Link}
                to="/seller/promotions"
                fullWidth
                variant="outlined"
                startIcon={<TrendingUpRounded />}
                sx={{
                  py: 1.4,
                  fontWeight: 800,
                  borderRadius: 2,
                }}
              >
                Promotions
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Order overview + sales */}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={5}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <SectionHeader
                title="Order Overview"
                action="View orders"
                to="/seller/orders"
              />

              <Stack spacing={1.5}>
                {orderStats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Stack
                      key={item.label}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Icon color="primary" fontSize="small" />

                        <Typography fontWeight={600}>
                          {item.label}
                        </Typography>
                      </Stack>

                      <Typography fontWeight={900}>
                        {item.value}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <SectionHeader
                title="Sales This Week"
                action="Analytics"
                to="/seller/analytics"
              />

              <Typography
                variant="h5"
                fontWeight={900}
                sx={{ mb: 2 }}
              >
                {formatCurrency(weekTotal)}
              </Typography>

              <Box
                sx={{
                  height: 180,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: { xs: 1, sm: 2 },
                  px: 1,
                }}
              >
                {salesData.map((item) => (
                  <Stack
                    key={item.time}
                    spacing={0.75}
                    alignItems="center"
                    sx={{ flex: 1, height: "100%", justifyContent: "flex-end" }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 42,
                        height: `${Math.max(
                          (item.value / maxSale) * 130,
                          8
                        )}px`,
                        borderRadius: "6px 6px 2px 2px",
                        bgcolor:
                          item.value > 0 ? "primary.main" : "action.selected",
                        transition: "height 0.3s ease",
                      }}
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {item.label}
                    </Typography>
                  </Stack>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent orders */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <SectionHeader
            title="Recent Orders"
            action="View all"
            to="/seller/orders"
          />

          {recentOrders.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              No orders yet. They will show up here as soon as a buyer
              checks out one of your products.
            </Typography>
          ) : (
            <Stack divider={<Divider />} spacing={0}>
              {recentOrders.map((order) => {
                const itemCount = Array.isArray(order.items)
                  ? order.items.length
                  : 0;

                const summary = Array.isArray(order.items)
                  ? order.items
                      .map((item) => item.title || item.name)
                      .filter(Boolean)
                      .join(", ")
                  : "";

                return (
                  <Stack
                    key={order.id}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    sx={{ py: 2 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={800}>
                        #{order.orderId || order.id}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                      >
                        {summary ||
                          `${itemCount} item${itemCount === 1 ? "" : "s"}`}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      flexWrap="wrap"
                    >
                      <Typography fontWeight={800}>
                        {formatCurrency(order.sellerNet)}
                      </Typography>

                      <StatusChip status={orderLabel(order)} />
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Products */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <SectionHeader
            title="Your Products"
            action="Manage products"
            to="/seller/products"
          />

          {recentProducts.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              You have not listed any products yet.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {recentProducts.map((product) => {
                const stock = Number(product.stock || 0);

                return (
                  <Grid item xs={12} sm={4} key={product.id}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        height: "100%",
                      }}
                    >
                      <Typography fontWeight={800} noWrap>
                        {product.title || product.name || "Untitled product"}
                      </Typography>

                      <Typography
                        color="primary"
                        fontWeight={800}
                        sx={{ mt: 0.5 }}
                      >
                        {formatCurrency(product.price)}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ mt: 1.5 }}
                        alignItems="center"
                      >
                        <Typography variant="caption" color="text.secondary">
                          {stock} in stock
                        </Typography>

                        <Chip
                          size="small"
                          variant="outlined"
                          color={product.isActive ? "success" : "default"}
                          label={product.isActive ? "Active" : "Inactive"}
                        />
                      </Stack>

                      {stock <= 2 && (
                        <Chip
                          icon={<WarningAmberRounded />}
                          label={stock === 0 ? "Out of stock" : "Low stock"}
                          size="small"
                          color="warning"
                          sx={{ mt: 1.5 }}
                        />
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Seller growth CTA */}
      <Card
        sx={{
          borderRadius: 3,
          bgcolor: "action.hover",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={900}>
                Grow your BIASHNET shop
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Add more products and use promotions to reach more buyers.
              </Typography>

              <LinearProgress
                variant="determinate"
                value={profileCompletion}
                sx={{
                  mt: 2,
                  maxWidth: 360,
                  height: 7,
                  borderRadius: 10,
                }}
              />

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.75 }}
              >
                Shop profile completion: {profileCompletion}%
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/seller/profile"
              variant="outlined"
              endIcon={<ArrowForwardRounded />}
              sx={{ fontWeight: 800 }}
            >
              Complete Shop Profile
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
