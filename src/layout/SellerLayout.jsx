import { useState } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AccountBalanceWalletRounded,
  AddRounded,
  AnalyticsRounded,
  BadgeRounded,
  ChatRounded,
  DashboardRounded,
  Inventory2Rounded,
  LogoutRounded,
  MenuRounded,
  NotificationsNoneRounded,
  PersonRounded,
  CampaignRounded,
  SettingsRounded,
  ShoppingBagRounded,
  StorefrontRounded,
  SwapHorizRounded,
  CloseRounded,
  FlashOnRounded,
} from "@mui/icons-material";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useEmployee } from "../hooks/useEmployee";

const sellerLinks = [
  {
    label: "Dashboard",
    to: "/seller/dashboard",
    icon: DashboardRounded,
  },
  {
    label: "My Products",
    to: "/seller/products",
    icon: Inventory2Rounded,
  },
  {
    label: "Add Product",
    to: "/seller/products/new",
    icon: AddRounded,
  },
  {
    label: "Orders",
    to: "/seller/orders",
    icon: ShoppingBagRounded,
  },
  {
    label: "Wallet",
    to: "/seller/wallet",
    icon: AccountBalanceWalletRounded,
  },
  {
    label: "Analytics",
    to: "/seller/analytics",
    icon: AnalyticsRounded,
  },
  {
    label: "Promotions",
    to: "/seller/promotions",
    icon: CampaignRounded,
  },
  {
    label: "Flash Sales",
    to: "/seller/flashsales",
    icon: FlashOnRounded,
  },
  {
    label: "Chat",
    to: "/seller/chat",
    icon: ChatRounded,
  },
  {
    label: "Profile",
    to: "/seller/profile",
    icon: PersonRounded,
  },
  {
    label: "Settings",
    to: "/seller/settings",
    icon: SettingsRounded,
  },
];

const mobileNavItems = [
  {
    label: "Home",
    to: "/seller/dashboard",
    icon: DashboardRounded,
  },
  {
    label: "Products",
    to: "/seller/products",
    icon: Inventory2Rounded,
  },
  {
    label: "Add",
    to: "/seller/products/new",
    icon: AddRounded,
  },
  {
    label: "Orders",
    to: "/seller/orders",
    icon: ShoppingBagRounded,
  },
  /*
   * Wallet rather than Chat: getting paid is the action sellers come
   * back for, and BottomNavigation only fits five. Chat is still one
   * tap away in the drawer.
   */
  {
    label: "Wallet",
    to: "/seller/wallet",
    icon: AccountBalanceWalletRounded,
  },
];

export default function SellerLayout() {
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isEmployee } = useEmployee();

  const currentPath = location.pathname;

  const isActive = (to) => {
    if (to === "/seller/dashboard") {
      return currentPath === to;
    }

    return currentPath === to || currentPath.startsWith(`${to}/`);
  };

  const handleNavigate = (to) => {
    navigate(to);
    setOpen(false);
  };

  const handleSwitchToBuyer = () => {
    setOpen(false);
    navigate("/");
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/");
  };

  const handleGoToEmployeeDashboard = () => {
    setOpen(false);
    navigate("/employee/dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* =========================
          TOP HEADER
      ========================== */}
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 60, md: 68 },
            px: { xs: 1.5, sm: 2, md: 3 },
          }}
        >
          {/* Mobile menu */}
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              display: { xs: "inline-flex", md: "none" },
              mr: 1,
            }}
          >
            <MenuRounded />
          </IconButton>

          {/* Logo / brand */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              minWidth: { md: 220 },
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 17,
              }}
            >
              B
            </Box>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography
                fontWeight={900}
                lineHeight={1}
                color="primary.main"
              >
                BIASHNET
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Seller Center
              </Typography>
            </Box>
          </Stack>

          {/* Desktop title */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "block" },
              ml: 3,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Seller Center
            </Typography>
          </Box>

          {/* Header actions */}
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Tooltip title="Notifications">
              <IconButton
                onClick={() => navigate("/seller/notifications")}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsNoneRounded />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="View Shop">
              <IconButton
                onClick={() => navigate("/")}
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                <StorefrontRounded />
              </IconButton>
            </Tooltip>

            <Avatar
              sx={{
                width: 36,
                height: 36,
                ml: 0.5,
                bgcolor: "primary.main",
                fontWeight: 800,
              }}
            >
              S
            </Avatar>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}
      <Box
        component="aside"
        sx={{
          display: { xs: "none", md: "block" },
          position: "fixed",
          left: 0,
          top: 68,
          bottom: 0,
          width: 260,
          borderRight: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflowY: "auto",
          zIndex: (theme) => theme.zIndex.drawer,
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Seller identity */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: "action.hover",
              mb: 2,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  fontWeight: 800,
                }}
              >
                S
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={800} noWrap>
                  My Shop
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Seller Account
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Typography
            variant="overline"
            color="text.secondary"
            sx={{
              px: 1.5,
              fontWeight: 800,
            }}
          >
            Seller Menu
          </Typography>

          <List sx={{ mt: 0.5 }}>
            {sellerLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);

              return (
                <ListItemButton
                  key={item.to}
                  component={Link}
                  to={item.to}
                  selected={active}
                  sx={{
                    mb: 0.5,
                    borderRadius: 2,
                    minHeight: 46,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "& .MuiListItemIcon-root": {
                        color: "inherit",
                      },
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: active
                        ? "inherit"
                        : "text.secondary",
                    }}
                  >
                    <Icon />
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 800 : 600,
                      fontSize: 14,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Switch to buyer */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<SwapHorizRounded />}
            onClick={handleSwitchToBuyer}
            sx={{
              justifyContent: "flex-start",
              py: 1.2,
              px: 1.5,
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            Switch to Buyer
          </Button>

          {isEmployee && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<BadgeRounded />}
              onClick={handleGoToEmployeeDashboard}
              sx={{
                justifyContent: "flex-start",
                py: 1.2,
                px: 1.5,
                mt: 0.5,
                fontWeight: 700,
                borderRadius: 2,
              }}
            >
              Employee Dashboard
            </Button>
          )}

          <Button
            fullWidth
            color="error"
            startIcon={<LogoutRounded />}
            onClick={handleLogout}
            sx={{
              justifyContent: "flex-start",
              py: 1.2,
              px: 1.5,
              mt: 0.5,
              fontWeight: 700,
              borderRadius: 2,
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* =========================
          MOBILE DRAWER
      ========================== */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 285,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                }}
              >
                B
              </Box>

              <Box>
                <Typography fontWeight={900}>
                  BIASHNET
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Seller Center
                </Typography>
              </Box>
            </Stack>

            <IconButton onClick={() => setOpen(false)}>
              <CloseRounded />
            </IconButton>
          </Stack>

          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2.5,
              bgcolor: "action.hover",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main" }}>
                S
              </Avatar>

              <Box>
                <Typography fontWeight={800}>
                  My Shop
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Seller Account
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ px: 1.5, fontWeight: 800 }}
          >
            Seller Menu
          </Typography>

          <List>
            {sellerLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);

              return (
                <ListItemButton
                  key={item.to}
                  onClick={() => handleNavigate(item.to)}
                  selected={active}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "& .MuiListItemIcon-root": {
                        color: "inherit",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: active
                        ? "inherit"
                        : "text.secondary",
                    }}
                  >
                    <Icon />
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 800 : 600,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>

          <Divider sx={{ my: 2 }} />

          <Button
            fullWidth
            variant="outlined"
            startIcon={<SwapHorizRounded />}
            onClick={handleSwitchToBuyer}
            sx={{
              justifyContent: "flex-start",
              py: 1.2,
              fontWeight: 700,
            }}
          >
            Switch to Buyer
          </Button>

          {isEmployee && (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<BadgeRounded />}
              onClick={handleGoToEmployeeDashboard}
              sx={{
                justifyContent: "flex-start",
                py: 1.2,
                mt: 0.5,
                fontWeight: 700,
              }}
            >
              Employee Dashboard
            </Button>
          )}

          <Button
            fullWidth
            color="error"
            startIcon={<LogoutRounded />}
            onClick={handleLogout}
            sx={{
              justifyContent: "flex-start",
              py: 1.2,
              mt: 0.5,
              fontWeight: 700,
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* =========================
          PAGE CONTENT
      ========================== */}
      <Box
        component="main"
        sx={{
          ml: { xs: 0, md: "260px" },
          pt: { xs: "76px", md: "84px" },
          pb: { xs: "88px", md: 4 },
          px: { xs: 1.5, sm: 2, md: 3 },
          width: {
            xs: "100%",
            md: "calc(100% - 260px)",
          },
          maxWidth: 1440,
          mx: { md: "auto" },
        }}
      >
        <Outlet />
      </Box>

      {/* =========================
          MOBILE BOTTOM NAV
      ========================== */}
      <Paper
        elevation={10}
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          borderTop: "1px solid",
          borderColor: "divider",
          borderRadius: 0,
        }}
      >
        <BottomNavigation
          value={
            mobileNavItems.findIndex((item) =>
              isActive(item.to)
            ) === -1
              ? 0
              : mobileNavItems.findIndex((item) =>
                  isActive(item.to)
                )
          }
          sx={{
            height: 68,
            px: 0.5,
          }}
        >
          {mobileNavItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <BottomNavigationAction
                key={item.to}
                label={item.label}
                icon={
                  item.label === "Add" ? (
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        mt: -1.5,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: 3,
                      }}
                    >
                      <Icon />
                    </Box>
                  ) : (
                    <Badge
                      color="error"
                      variant={
                        item.label === "Chat"
                          ? "dot"
                          : "standard"
                      }
                    >
                      <Icon />
                    </Badge>
                  )
                }
                onClick={() => handleNavigate(item.to)}
                sx={{
                  minWidth: 0,
                  maxWidth: "20%",
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: "0.68rem",
                    fontWeight: 700,
                  },
                }}
              />
            );
          })}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}