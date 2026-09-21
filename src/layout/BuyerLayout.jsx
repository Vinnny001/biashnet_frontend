// src/layouts/BuyerLayout.jsx

import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
  InputBase,
  Tooltip,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

import { APP_NAME } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useUnreadNotifications } from "../hooks/useUnreadNotifications";
import { useThemeMode } from "../context/ThemeContext";
import AccountSwitcher from "../components/common/AccountSwitcher";

const NAV = [
  { label: "Home", to: "/buyer/products", icon: HomeRoundedIcon },
  { label: "Explore", to: "/explore", icon: ExploreRoundedIcon },
  { label: "Cart", to: "/cart", icon: ShoppingCartRoundedIcon },
  { label: "Orders", to: "/orders", icon: ReceiptLongRoundedIcon },
  { label: "Account", to: "/profile", icon: PersonRoundedIcon },
];

const isActive = (pathname, to) => {
  if (to === "/buyer/products") return pathname === to;
  return pathname.startsWith(to);
};

export default function BuyerLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { user, logout } = useAuth();
  const { count: cartCount } = useCart();
  const { count: unreadNotifications } =
    useUnreadNotifications("BUYER");

  const { isDark, changeTheme } = useThemeMode();

  const [profileAnchor, setProfileAnchor] = useState(null);
  const [search, setSearch] = useState("");

  const activeIndex = NAV.findIndex((item) =>
    isActive(pathname, item.to)
  );

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const submitSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const closeMenu = () => setProfileAnchor(null);

  const go = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      {/* ================= HEADER ================= */}

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: 1200,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* TOP ROW */}

        <Toolbar
          sx={{
            minHeight: { xs: 56, md: 64 },
            px: { xs: 1.5, sm: 2, md: 3 },
            gap: { xs: 0.5, md: 2 },
          }}
        >
          {/* LOGO */}

          <Typography
            component={Link}
            to="/buyer/products"
            sx={{
              color: "primary.main",
              fontWeight: 900,
              fontSize: { xs: "1.15rem", md: "1.4rem" },
              letterSpacing: "-0.5px",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            {APP_NAME}
          </Typography>

          {/* DESKTOP NAV */}

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.5,
              flex: 1,
            }}
          >
            {NAV.slice(0, 2).map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.to);

              return (
                <Box
                  key={item.to}
                  component={Link}
                  to={item.to}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.7,
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    textDecoration: "none",
                    color: active
                      ? "primary.main"
                      : "text.secondary",
                    fontWeight: active ? 800 : 600,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Icon fontSize="small" />
                  {item.label}
                </Box>
              );
            })}
          </Box>

          {/* DESKTOP SEARCH */}

          <Box
            component="form"
            onSubmit={submitSearch}
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              width: { md: 300, lg: 420 },
              height: 42,
              px: 1.5,
              borderRadius: 3,
              bgcolor: "action.hover",
              border: "1px solid",
              borderColor: "divider",
              "&:focus-within": {
                borderColor: "primary.main",
              },
            }}
          >
            <SearchRoundedIcon
              sx={{ color: "text.secondary", mr: 1 }}
            />

            <InputBase
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, services..."
              fullWidth
              sx={{
                color: "text.primary",
                fontSize: ".9rem",
              }}
            />
          </Box>

          {/* DESKTOP ACTIONS */}

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Tooltip title="Chat">
              <IconButton onClick={() => navigate("/chat")}>
                <ChatRoundedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton
                onClick={() => navigate("/notifications")}
              >
                <Badge
                  badgeContent={unreadNotifications}
                  max={99}
                  color="error"
                >
                  <NotificationsRoundedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Cart">
              <IconButton onClick={() => navigate("/cart")}>
                <Badge
                  badgeContent={cartCount}
                  max={99}
                  color="primary"
                >
                  <ShoppingCartRoundedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={(e) => setProfileAnchor(e.currentTarget)}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: ".8rem",
                  fontWeight: 800,
                }}
              >
                {initials}
              </Avatar>
            </IconButton>
          </Box>

          {/* MOBILE ACTIONS */}

          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 0.2,
              ml: "auto",
            }}
          >
            <IconButton
              size="small"
              onClick={() => navigate("/notifications")}
            >
              <Badge
                badgeContent={unreadNotifications}
                max={99}
                color="error"
              >
                <NotificationsRoundedIcon fontSize="small" />
              </Badge>
            </IconButton>

            <IconButton
              size="small"
              onClick={() => navigate("/cart")}
            >
              <Badge
                badgeContent={cartCount}
                max={99}
                color="primary"
              >
                <ShoppingCartRoundedIcon fontSize="small" />
              </Badge>
            </IconButton>

            <IconButton
              size="small"
              onClick={(e) => setProfileAnchor(e.currentTarget)}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontSize: ".7rem",
                  fontWeight: 800,
                }}
              >
                {initials}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>

        {/* MOBILE SEARCH */}

        <Box
          component="form"
          onSubmit={submitSearch}
          sx={{
            display: { xs: "flex", md: "none" },
            mx: 1.5,
            mb: 1.2,
            height: 44,
            alignItems: "center",
            px: 1.5,
            borderRadius: 3,
            bgcolor: "action.hover",
            border: "1px solid",
            borderColor: "divider",
            "&:focus-within": {
              borderColor: "primary.main",
            },
          }}
        >
          <SearchRoundedIcon
            sx={{
              color: "text.secondary",
              mr: 1,
            }}
          />

          <InputBase
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, services & more"
            fullWidth
            sx={{
              color: "text.primary",
              fontSize: ".85rem",
            }}
          />
        </Box>
      </AppBar>

      {/* ================= PROFILE MENU ================= */}

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={closeMenu}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
            borderRadius: 3,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography fontWeight={800}>
            {user?.name || "My Account"}
          </Typography>

          {user?.email && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                maxWidth: 190,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.email}
            </Typography>
          )}
        </Box>

        <Divider />

        <MenuItem onClick={() => go("/profile")}>
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem onClick={() => go("/account/settings")}>
          <ListItemIcon>
            <SettingsRoundedIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <MenuItem onClick={() => go("/buyer/payments")}>
          <ListItemIcon>
            <PaymentsRoundedIcon fontSize="small" />
          </ListItemIcon>
          Payment History
        </MenuItem>

        <Divider />

        {/* THEME */}

        <MenuItem
          onClick={() =>
            changeTheme(isDark ? "light" : "dark")
          }
        >
          <ListItemIcon>
            {isDark ? (
              <LightModeRoundedIcon fontSize="small" />
            ) : (
              <DarkModeRoundedIcon fontSize="small" />
            )}
          </ListItemIcon>

          {isDark ? "Light Mode" : "Dark Mode"}
        </MenuItem>

        <AccountSwitcher onDone={closeMenu} />

        <Divider />

        <MenuItem
          onClick={() => {
            logout();
            closeMenu();
          }}
        >
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* ================= CONTENT ================= */}

      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: 1440,
          mx: "auto",

          px: {
            xs: 1.25,
            sm: 2,
            md: 3,
            lg: 4,
          },

          pt: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },

          pb: {
            xs: "88px",
            md: 3,
          },
        }}
      >
        <Outlet />
      </Box>

      {/* ================= MOBILE NAV ================= */}

      <Paper
        elevation={10}
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,

          borderTop: "1px solid",
          borderColor: "divider",

          pb: "env(safe-area-inset-bottom)",
        }}
      >
        <BottomNavigation
          value={activeIndex === -1 ? false : activeIndex}
          onChange={(_, index) => navigate(NAV[index].to)}
          sx={{
            height: 62,
            bgcolor: "background.paper",
          }}
        >
          {NAV.map((item, index) => {
            const Icon = item.icon;
            const active = activeIndex === index;

            return (
              <BottomNavigationAction
                key={item.to}
                label={item.label}
                icon={
                  item.label === "Cart" ? (
                    <Badge
                      badgeContent={cartCount}
                      color="primary"
                      max={99}
                    >
                      <Icon />
                    </Badge>
                  ) : (
                    <Icon />
                  )
                }
                sx={{
                  minWidth: 0,
                  px: 0.5,

                  color: "text.secondary",

                  "&.Mui-selected": {
                    color: "primary.main",
                  },

                  "& .MuiBottomNavigationAction-label": {
                    fontSize: ".65rem",
                    fontWeight: active ? 800 : 600,
                    mt: 0.3,
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