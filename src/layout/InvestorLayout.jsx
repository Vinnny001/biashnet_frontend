import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

import { APP_NAME } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";
import AccountSwitcher from "../components/common/AccountSwitcher";

export default function InvestorLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileAnchor, setProfileAnchor] = useState(null);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "I";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider"
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Typography
            component={Link}
            to="/investor/dashboard"
            variant="h5"
            sx={{ color: "primary.main", fontWeight: 800, textDecoration: "none" }}
          >
            {APP_NAME}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: { xs: "none", sm: "block" }, ml: 1 }}
          >
            Investor Portal
          </Typography>

          <Box sx={{ flex: 1 }} />

          <TrendingUpIcon sx={{ color: "primary.main", mr: 1 }} />

          <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: "0.85rem" }}>
              {initials}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

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
        <MenuItem onClick={() => { navigate("/account/profile"); setProfileAnchor(null); }}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>

        <AccountSwitcher onDone={() => setProfileAnchor(null)} />

        <Divider />
        <MenuItem onClick={() => { logout(); setProfileAnchor(null); }}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}
