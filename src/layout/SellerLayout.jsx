import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const sellerLinks = [
  { label: "Dashboard", to: "/seller/dashboard" },
  { label: "Products", to: "/seller/products" },
  { label: "Add Product", to: "/seller/products/new" },
  { label: "Orders", to: "/seller/orders" },
  { label: "Analytics", to: "/seller/analytics" },
  { label: "Chat", to: "/seller/chat" },
  { label: "Settings", to: "/seller/settings" }
];

export default function SellerLayout() {
  const [open, setOpen] = useState(false);

  return (
    <Box className="app-shell">
      <Header onMenu={() => setOpen(true)} />
      <Sidebar open={open} onClose={() => setOpen(false)} links={sellerLinks} />
      <Box
        component="main"
        sx={{ ml: { md: "260px" }, p: { xs: 2, md: 3 }, maxWidth: 1280 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
