import { useMemo } from "react";
import {
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
  ChatBubbleRounded,
  TrendingUpRounded,
  WarningAmberRounded,
  VisibilityRounded,
  LocalShippingRounded,
  CheckCircleRounded,
  AccessTimeRounded,
} from "@mui/icons-material";

import { Link } from "react-router-dom";

const stats = [
  {
    label: "Active Listings",
    value: "12",
    change: "+3 this month",
    icon: Inventory2Rounded,
  },
  {
    label: "Total Orders",
    value: "8",
    change: "+2 this week",
    icon: ShoppingBagRounded,
  },
  {
    label: "Revenue",
    value: "KES 42,000",
    change: "+12.5%",
    icon: PaymentsRounded,
  },
  {
    label: "Messages",
    value: "5",
    change: "3 unread",
    icon: ChatBubbleRounded,
  },
];

const orderStats = [
  {
    label: "Pending",
    value: 3,
    icon: AccessTimeRounded,
  },
  {
    label: "Processing",
    value: 2,
    icon: Inventory2Rounded,
  },
  {
    label: "Shipped",
    value: 2,
    icon: LocalShippingRounded,
  },
  {
    label: "Completed",
    value: 8,
    icon: CheckCircleRounded,
  },
];

const recentOrders = [
  {
    id: "BN1024",
    product: "Samsung Galaxy A15",
    customer: "Customer",
    amount: 18000,
    status: "Pending",
  },
  {
    id: "BN1023",
    product: "Nike Running Shoes",
    customer: "Customer",
    amount: 4500,
    status: "Processing",
  },
  {
    id: "BN1022",
    product: "Wireless Headphones",
    customer: "Customer",
    amount: 3200,
    status: "Shipped",
  },
];

const products = [
  {
    name: "Samsung Galaxy A15",
    price: 18000,
    views: 324,
    stock: 5,
  },
  {
    name: "Nike Running Shoes",
    price: 4500,
    views: 218,
    stock: 8,
  },
  {
    name: "Wireless Headphones",
    price: 3200,
    views: 156,
    stock: 2,
  },
];

const salesData = [
  { label: "Mon", value: 4200 },
  { label: "Tue", value: 6800 },
  { label: "Wed", value: 5200 },
  { label: "Thu", value: 9100 },
  { label: "Fri", value: 7400 },
  { label: "Sat", value: 6300 },
  { label: "Sun", value: 3000 },
];

function formatCurrency(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
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
              color="success.main"
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
    Pending: {
      color: "warning",
      icon: <AccessTimeRounded sx={{ fontSize: 15 }} />,
    },
    Processing: {
      color: "info",
      icon: <Inventory2Rounded sx={{ fontSize: 15 }} />,
    },
    Shipped: {
      color: "primary",
      icon: <LocalShippingRounded sx={{ fontSize: 15 }} />,
    },
    Completed: {
      color: "success",
      icon: <CheckCircleRounded sx={{ fontSize: 15 }} />,
    },
  };

  const item = config[status] || config.Pending;

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
  const maxSale = useMemo(
    () => Math.max(...salesData.map((item) => item.value), 1),
    []
  );

  return (
    <Stack spacing={3}>
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
              Seller Dashboard
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
                to="/seller/products"
                fullWidth
                variant="outlined"
                startIcon={<Inventory2Rounded />}
                sx={{
                  py: 1.4,
                  fontWeight: 800,
                  borderRadius: 2,
                }}
              >
                Products
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
                KES 42,000
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
                    key={item.label}
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
                        bgcolor: "primary.main",
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

          <Stack divider={<Divider />} spacing={0}>
            {recentOrders.map((order) => (
              <Stack
                key={order.id}
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                sx={{ py: 2 }}
              >
                <Box>
                  <Typography fontWeight={800}>
                    #{order.id}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {order.product}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  flexWrap="wrap"
                >
                  <Typography fontWeight={800}>
                    {formatCurrency(order.amount)}
                  </Typography>

                  <StatusChip status={order.status} />
                </Stack>
              </Stack>
            ))}
          </Stack>
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

          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={4} key={product.name}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    height: "100%",
                  }}
                >
                  <Typography fontWeight={800} noWrap>
                    {product.name}
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
                  >
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <VisibilityRounded
                        sx={{ fontSize: 16 }}
                        color="action"
                      />
                      <Typography variant="caption">
                        {product.views} views
                      </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      {product.stock} in stock
                    </Typography>
                  </Stack>

                  {product.stock <= 2 && (
                    <Chip
                      icon={<WarningAmberRounded />}
                      label="Low stock"
                      size="small"
                      color="warning"
                      sx={{ mt: 1.5 }}
                    />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
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
                value={60}
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
                Shop profile completion: 60%
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