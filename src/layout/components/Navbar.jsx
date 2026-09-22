import { Stack, Button } from "@mui/material";
import { Link, useLocation, useSearchParams } from "react-router-dom";

/*
 * The four things Biashnet sells, matching the categories on the home
 * page. They are filters on the products page rather than pages of their
 * own, so they all share the path /products and differ only by the
 * ?category= on the end.
 *
 * That is why the active link is worked out here instead of letting
 * NavLink do it: NavLink compares paths and ignores the query, so every
 * category link lit up gold at once.
 */
const links = [
  { label: "Home", to: "/", category: null },
  { label: "Products", to: "/products", category: "" },
  { label: "Services", to: "/products?category=services", category: "services" },
  { label: "Houses", to: "/products?category=houses", category: "houses" },
  { label: "Adverts", to: "/products?category=adverts", category: "adverts" }
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();

  const category = (searchParams.get("category") || "").toLowerCase();
  const onProducts = pathname.startsWith("/products");

  const isActive = (link) => {
    if (link.category === null) return pathname === "/";
    return onProducts && category === link.category;
  };

  return (
    <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
      {links.map((link) => (
        <Button
          key={link.to}
          component={Link}
          to={link.to}
          color="inherit"
          sx={{
            fontWeight: isActive(link) ? 700 : 500,
            color: isActive(link) ? "primary.main" : "text.primary"
          }}
        >
          {link.label}
        </Button>
      ))}
    </Stack>
  );
}
