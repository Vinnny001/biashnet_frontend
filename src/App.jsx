import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ModalProvider } from "./context/ModalContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UserProvider } from "./context/UserContext";
import { useNotification } from "./hooks/useNotification";

function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (Capacitor.getPlatform() !== "android") return;

    const listenerPromise = CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      const atRoot = location.pathname === "/" || location.pathname === "/home";
      if (atRoot || !canGoBack) {
        CapacitorApp.exitApp();
      } else {
        navigate(-1);
      }
    });

    return () => {
      listenerPromise.then((listener) => listener.remove());
    };
  }, [location, navigate]);

  return null;
}

function AppNotifications() {
  const { notification, clear } = useNotification();

  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={4000}
      onClose={clear}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      {notification ? (
        <Alert severity={notification.severity} onClose={clear} variant="filled">
          {notification.message}
        </Alert>
      ) : null}
    </Snackbar>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <UserProvider>
          <CartProvider>
            <ModalProvider>
              <AppRoutes />
              <BackButtonHandler />
              <AppNotifications />
            </ModalProvider>
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}