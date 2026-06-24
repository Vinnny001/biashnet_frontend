import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar, Avatar, Badge, BottomNavigation, BottomNavigationAction,
  Box, Divider, IconButton, ListItemIcon, Menu, MenuItem,
  Paper, Toolbar, Typography
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { APP_NAME } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const GOLD = "#d4af37";

const NAV_ITEMS = [
  { label: "Home",     to: "/home",     icon: HomeIcon },
  { label: "Products", to: "/products", icon: StoreIcon },
  { label: "Services", to: "/services", icon: MiscellaneousServicesIcon },
  { label: "Houses",   to: "/houses",   icon: HomeWorkIcon },
  { label: "Orders",   to: "/orders",   icon: ReceiptLongIcon }
];

function useActiveNav() {
  const { pathname } = useLocation();
  const idx = NAV_ITEMS.findIndex((item) =>
    item.to === "/home" ? pathname === "/home" : pathname.startsWith(item.to)
  );
  return idx;
}

export default function BuyerLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const activeNav = useActiveNav();
  const [profileAnchor, setProfileAnchor] = useState(null);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ─── TOP APPBAR ─── */}
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{ bgcolor: "background.default", borderBottom: "1px solid", borderColor: "divider", zIndex: 1200 }}
      >
        <Toolbar sx={{ gap: 1 }}>
          {/* Brand */}
          <Typography
            component={Link}
            to="/home"
            variant="h5"
            sx={{ color: "primary.main", fontWeight: 800, textDecoration: "none", flexShrink: 0 }}
          >
            {APP_NAME}
          </Typography>

          {/* ── DESKTOP NAV LINKS ── */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, ml: 3, flex: 1 }}>
            {NAV_ITEMS.map((item, i) => (
              <Box
                key={item.to}
                component={Link}
                to={item.to}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.9rem",
                  fontWeight: activeNav === i ? 700 : 400,
                  color: activeNav === i ? "primary.main" : "text.primary",
                  textDecoration: "none",
                  "&:hover": { bgcolor: "action.hover" }
                }}
              >
                {item.label}
              </Box>
            ))}
          </Box>

          <Box sx={{ flex: 1, display: { md: "none" } }} />

          {/* ── MOBILE TOP-RIGHT ICONS ── */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 0.5 }}>
            <IconButton component={Link} to="/cart" size="small">
              <Badge badgeContent={count} color="primary">
                <ShoppingCartIcon fontSize="small" />
              </Badge>
            </IconButton>
            <IconButton component={Link} to="/chat" size="small">
              <ChatIcon fontSize="small" sx={{ color: GOLD }} />
            </IconButton>
            <IconButton component={Link} to="/notifications" size="small">
              <NotificationsIcon fontSize="small" sx={{ color: GOLD }} />
            </IconButton>
            <IconButton size="small" onClick={(e) => setProfileAnchor(e.currentTarget)}>
              <Avatar sx={{ width: 30, height: 30, bgcolor: "primary.main", fontSize: "0.75rem" }}>
                {initials}
              </Avatar>
            </IconButton>
          </Box>

          {/* ── DESKTOP RIGHT: profile (expands to show cart/chat/bell) ── */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            <IconButton component={Link} to="/cart">
              <Badge badgeContent={count} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton component={Link} to="/chat">
              <ChatIcon sx={{ color: GOLD }} />
            </IconButton>
            <IconButton component={Link} to="/notifications">
              <NotificationsIcon sx={{ color: GOLD }} />
            </IconButton>
            <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: "0.85rem" }}>
                {initials}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── PROFILE DROPDOWN MENU (shared mobile + desktop) ── */}
      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {user?.name && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user.email}</Typography>
          </Box>
        )}
        <Divider />
        <MenuItem onClick={() => { navigate("/profile"); setProfileAnchor(null); }}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate("/account/settings"); setProfileAnchor(null); }}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { logout(); setProfileAnchor(null); }}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* ── PAGE CONTENT ── */}
      <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 }, pb: { xs: 10, md: 3 } }}>
        <Outlet />
      </Box>

      {/* ── MOBILE BOTTOM NAV ── */}
      <Paper
        elevation={4}
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, display: { xs: "block", md: "none" }, zIndex: 1300 }}
      >
        <BottomNavigation
          value={activeNav === -1 ? false : activeNav}
          onChange={(_, newValue) => navigate(NAV_ITEMS[newValue].to)}
          showLabels={false}
        >
          {NAV_ITEMS.map((item, i) => (
            <BottomNavigationAction
              key={item.to}
              icon={<item.icon />}
              label={item.label}
              showLabel={activeNav === i}
              sx={{
                color: activeNav === i ? "primary.main" : "text.secondary",
                minWidth: 0,
                "& .MuiBottomNavigationAction-label": { fontSize: "0.65rem" }
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}