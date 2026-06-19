import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Products", to: "/admin/products" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Users", to: "/admin/users" },
  { label: "Sellers", to: "/admin/sellers" },
  { label: "Analytics", to: "/admin/analytics" },
  { label: "Reports", to: "/admin/reports" },
  { label: "Moderation", to: "/admin/moderation" },
  { label: "Settings", to: "/admin/settings" }
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <Box className="app-shell">
      <Header onMenu={() => setOpen(true)} />
      <Sidebar open={open} onClose={() => setOpen(false)} links={adminLinks} />
      <Box
        component="main"
        sx={{ ml: { md: "260px" }, p: { xs: 2, md: 3 }, maxWidth: 1280 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
