import { useState } from "react";
import {
  AppBar,
  Avatar,
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
  Typography,
} from "@mui/material";

import {
  AccountBalanceWalletRounded,
  BadgeRounded,
  CloseRounded,
  DashboardRounded,
  FactCheckRounded,
  GroupsRounded,
  HandshakeRounded,
  LogoutRounded,
  MenuRounded,
  PaidRounded,
  ReceiptLongRounded,
  SwapHorizRounded,
  TrendingUpRounded,
  WorkRounded,
} from "@mui/icons-material";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useEmployee } from "../hooks/useEmployee";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/employee/dashboard", icon: DashboardRounded },
  { label: "Employees", to: "/employee/employees", icon: GroupsRounded, roles: ["hr", "admin", "ceo"] },
  { label: "Positions", to: "/employee/positions", icon: WorkRounded, roles: ["hr", "admin"] },
  { label: "Expenses", to: "/employee/expenses", icon: ReceiptLongRounded, roles: ["accountant", "admin"] },
  { label: "Payroll", to: "/employee/payroll", icon: PaidRounded, roles: ["accountant", "admin"] },
  { label: "Approvals", to: "/employee/approvals", icon: FactCheckRounded, roles: ["admin", "ceo"] },
  { label: "Investors", to: "/employee/investors", icon: TrendingUpRounded },
  { label: "Loans", to: "/employee/loans", icon: HandshakeRounded, roles: ["accountant", "admin"] },
  { label: "Wallet", to: "/employee/wallet", icon: AccountBalanceWalletRounded },
];

export default function EmployeeLayout() {
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { employee, hasRole } = useEmployee();

  const currentPath = location.pathname;

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || hasRole(...item.roles)
  );

  const isActive = (to) =>
    currentPath === to || currentPath.startsWith(`${to}/`);

  const handleNavigate = (to) => {
    navigate(to);
    setOpen(false);
  };

  const handleSwitchBack = () => {
    setOpen(false);
    navigate("/");
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate("/");
  };

  const positionLabel = employee?.positionId ? "Employee" : "Employee";

  const navList = (onNavigate) => (
    <List sx={{ mt: 0.5 }}>
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.to);

        return (
          <ListItemButton
            key={item.to}
            onClick={onNavigate ? () => onNavigate(item.to) : undefined}
            component={onNavigate ? "div" : Link}
            to={onNavigate ? undefined : item.to}
            selected={active}
            sx={{
              mb: 0.5,
              borderRadius: 2,
              minHeight: 46,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": { color: "inherit" },
              },
              "&.Mui-selected:hover": { bgcolor: "primary.dark" },
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 40, color: active ? "inherit" : "text.secondary" }}
            >
              <Icon />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: active ? 800 : 600, fontSize: 14 }}
            />
          </ListItemButton>
        );
      })}
    </List>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* TOP HEADER */}
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
        <Toolbar sx={{ minHeight: { xs: 60, md: 68 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" }, mr: 1 }}
          >
            <MenuRounded />
          </IconButton>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: { md: 220 }, flexShrink: 0 }}>
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
              <Typography fontWeight={900} lineHeight={1} color="primary.main">
                BIASHNET
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Employee Center
              </Typography>
            </Box>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main", fontWeight: 800 }}>
            <BadgeRounded fontSize="small" />
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* DESKTOP SIDEBAR */}
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
          <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: "action.hover", mb: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main", fontWeight: 800 }}>
                <BadgeRounded fontSize="small" />
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={800} noWrap>
                  {positionLabel}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {employee?.employmentStatus === "active" ? "Active" : "Employee Account"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Typography variant="overline" color="text.secondary" sx={{ px: 1.5, fontWeight: 800 }}>
            Employee Menu
          </Typography>

          {navList()}

          <Divider sx={{ my: 2 }} />

          <Button
            fullWidth
            variant="outlined"
            startIcon={<SwapHorizRounded />}
            onClick={handleSwitchBack}
            sx={{ justifyContent: "flex-start", py: 1.2, px: 1.5, fontWeight: 700, borderRadius: 2 }}
          >
            Back to Marketplace
          </Button>

          <Button
            fullWidth
            color="error"
            startIcon={<LogoutRounded />}
            onClick={handleLogout}
            sx={{ justifyContent: "flex-start", py: 1.2, px: 1.5, mt: 0.5, fontWeight: 700, borderRadius: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: 285, boxSizing: "border-box" } }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
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
                <Typography fontWeight={900}>BIASHNET</Typography>
                <Typography variant="caption" color="text.secondary">
                  Employee Center
                </Typography>
              </Box>
            </Stack>
            <IconButton onClick={() => setOpen(false)}>
              <CloseRounded />
            </IconButton>
          </Stack>

          <Typography variant="overline" color="text.secondary" sx={{ px: 1.5, fontWeight: 800 }}>
            Employee Menu
          </Typography>

          {navList(handleNavigate)}

          <Divider sx={{ my: 2 }} />

          <Button
            fullWidth
            variant="outlined"
            startIcon={<SwapHorizRounded />}
            onClick={handleSwitchBack}
            sx={{ justifyContent: "flex-start", py: 1.2, fontWeight: 700 }}
          >
            Back to Marketplace
          </Button>

          <Button
            fullWidth
            color="error"
            startIcon={<LogoutRounded />}
            onClick={handleLogout}
            sx={{ justifyContent: "flex-start", py: 1.2, mt: 0.5, fontWeight: 700 }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* PAGE CONTENT */}
      <Box
        component="main"
        sx={{
          ml: { xs: 0, md: "260px" },
          pt: { xs: "76px", md: "84px" },
          pb: { xs: "88px", md: 4 },
          px: { xs: 1.5, sm: 2, md: 3 },
          width: { xs: "100%", md: "calc(100% - 260px)" },
          maxWidth: 1440,
          mx: { md: "auto" },
        }}
      >
        <Outlet />
      </Box>

      {/* MOBILE BOTTOM NAV */}
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
            visibleItems.slice(0, 5).findIndex((item) => isActive(item.to)) === -1
              ? 0
              : visibleItems.slice(0, 5).findIndex((item) => isActive(item.to))
          }
          sx={{ height: 68, px: 0.5 }}
        >
          {visibleItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <BottomNavigationAction
                key={item.to}
                label={item.label}
                icon={<Icon />}
                onClick={() => handleNavigate(item.to)}
                sx={{
                  minWidth: 0,
                  maxWidth: "20%",
                  "& .MuiBottomNavigationAction-label": { fontSize: "0.62rem", fontWeight: 700 },
                }}
              />
            );
          })}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
