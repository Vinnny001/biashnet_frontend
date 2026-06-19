import { Box, Button, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Orders", to: "/orders" },
  { label: "Seller", to: "/seller/dashboard" }
];

export default function Navbar() {
  return (
    <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
      {links.map((link) => (
        <Button
          key={link.to}
          component={NavLink}
          to={link.to}
          color="inherit"
          sx={{
            "&.active": {
              color: "primary.main"
            }
          }}
        >
          {link.label}
        </Button>
      ))}
    </Stack>
  );
}
