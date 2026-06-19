import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function GuestLayout() {
  return (
    <Box className="app-shell" sx={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <Box component="main" className="app-content" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
