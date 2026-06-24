import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Divider, Drawer, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const guestLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Services", to: "/services" },
  { label: "Houses", to: "/houses" },
  { label: "My Orders", to: "/orders" },
  
  { label: "About", to: "/about" },
  { label: "Sign up", to: "/signup" }
];

export default function GuestLayout() {
  const [open, setOpen] = useState(false);

  return (
    <Box className="app-shell" sx={{ display: "flex", flexDirection: "column" }}>
      <Header onMenu={() => setOpen(true)} />

      {/* Mobile-only drawer — no permanent sidebar on desktop for guest */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box sx={{ width: 260 }}>
          <Toolbar />
          <Divider />
          <List>
            {guestLinks.map((link) => (
              <ListItemButton
                key={link.to}
                component={NavLink}
                to={link.to}
                onClick={() => setOpen(false)}
                sx={{ "&.active": { color: "primary.main" } }}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" className="app-content" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}