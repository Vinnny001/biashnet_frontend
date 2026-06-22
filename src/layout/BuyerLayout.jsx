import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

const mobileLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Cart", to: "/cart" },
  { label: "Orders", to: "/orders" },
  { label: "Profile", to: "/profile" }
];

export default function BuyerLayout() {
  const [open, setOpen] = useState(false);

  return (
    <Box className="app-shell" sx={{ display: "flex", flexDirection: "column" }}>
      <Header onMenu={() => setOpen(true)} />
      <Sidebar open={open} onClose={() => setOpen(false)} links={mobileLinks} permanent={true} />
      <Box component="main" className="app-content" sx={{ ml: { md: "260px" }, p: { xs: 2, md: 3 }, flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
