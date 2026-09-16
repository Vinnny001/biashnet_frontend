import { Stack, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

/*
 * The four things Biashnet sells, matching the categories on the landing
 * page. They are filters on the products page rather than pages of their
 * own — /services and /houses were links to nowhere.
 */
const links = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Services", to: "/products?category=services" },
  { label: "Houses", to: "/products?category=houses" },
  { label: "Adverts", to: "/products?category=adverts" }
];

export default function Navbar() {
  return (
    <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
      {links.map((link) => (
        <Button
          key={link.to}
          component={NavLink}
          to={link.to}
          end
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
