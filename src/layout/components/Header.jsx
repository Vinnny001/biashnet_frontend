import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { APP_NAME } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import Navbar from "./Navbar";

const NAVBAR_PATHS = ["/", "/home"];

export default function Header({ onMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { count } = useCart();
  const { isAuthenticated, logout, user } = useAuth();

  const showExtras = NAVBAR_PATHS.includes(location.pathname);
  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{ bgcolor: "background.default", borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {onMenu ? (
          <IconButton onClick={onMenu} sx={{ display: { md: "none" } }} aria-label="Open menu">
            <MenuIcon />
          </IconButton>
        ) : null}
        <Typography
          component={Link}
          to="/"
          variant="h5"
          sx={{ color: "primary.main", fontWeight: 800, mr: "auto" }}
        >
          {APP_NAME}
        </Typography>
        {showExtras ? <Navbar /> : null}
        {showExtras ? (
  <IconButton component={Link} to="/cart" aria-label="Open cart">
    <Badge badgeContent={count} color="primary">
      <ShoppingCartIcon />
    </Badge>
  </IconButton>
) : null}
        {isAuthenticated ? (
          <Button color="primary" variant="outlined" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button color="primary" variant="contained" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
        {user?.name ? (
          <Box sx={{ color: "text.secondary", display: { xs: "none", lg: "block" } }}>
            {user.name}
          </Box>
        ) : null}
      </Toolbar>
    </AppBar>
  );
}