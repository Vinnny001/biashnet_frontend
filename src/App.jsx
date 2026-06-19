import { Alert, Snackbar } from "@mui/material";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ModalProvider } from "./context/ModalContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UserProvider } from "./context/UserContext";
import { useNotification } from "./hooks/useNotification";

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
              <AppNotifications />
            </ModalProvider>
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
