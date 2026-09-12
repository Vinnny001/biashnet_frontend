import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  AccessTimeRounded,
  CheckCircleRounded,
  DoneAllRounded,
  ErrorOutlineRounded,
  LocalShippingRounded,
  NotificationsNoneRounded,
  PaymentsRounded,
  ReceiptLongRounded,
  RefreshRounded,
  ShoppingBagRounded,
  VpnKeyRounded,
} from "@mui/icons-material";

import { Link } from "react-router-dom";

import Loading from "../../components/common/Loading";

import { notificationService } from "../../services/notification.service";
import { getErrorMessage } from "../../utils/errors";
import { formatDate } from "../../utils/formatters";

/*
 * One entry per notification type the order lifecycle emits. Anything
 * unrecognised still renders — it just falls back to a neutral icon
 * rather than disappearing, so a new backend notification type is never
 * silently invisible here.
 */
const TYPE_STYLES = {
  MARKETPLACE_ORDER_PLACED: { icon: ShoppingBagRounded, color: "info" },
  MARKETPLACE_PAYMENT_SUCCESS: { icon: PaymentsRounded, color: "success" },
  ORDER_COMPLETION_CODE: { icon: VpnKeyRounded, color: "warning" },
  NEW_MARKETPLACE_ORDER: { icon: ShoppingBagRounded, color: "info" },
  DROPOFF_CONFIRMED: { icon: CheckCircleRounded, color: "success" },
  SELLER_DROPOFF_RECEIVED: { icon: CheckCircleRounded, color: "success" },
  ORDER_OUT_FOR_DELIVERY: { icon: LocalShippingRounded, color: "primary" },
  ORDER_COMPLETED: { icon: CheckCircleRounded, color: "success" },
  ORDER_CANCELLED: { icon: ErrorOutlineRounded, color: "error" },
  ORDER_CANCELLED_REFUNDED: { icon: ErrorOutlineRounded, color: "error" },
  SELLER_NON_COMPLIANT: { icon: AccessTimeRounded, color: "error" },
  PARTIAL_FULFILLMENT_CHOICE: { icon: ReceiptLongRounded, color: "warning" },
};

/*
 * The two notification writers in the payment service store the order id
 * differently — one puts it at the top level, the other nests it under
 * `data`. Read both so every notification can link to its order.
 */
function orderIdOf(notification) {
  return notification?.orderId || notification?.data?.orderId || null;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await notificationService.list();

      setNotifications(
        Array.isArray(response?.notifications) ? response.notifications : []
      );
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError(getErrorMessage(err, "Could not load your notifications."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.read !== true).length,
    [notifications]
  );

  async function handleMarkAllRead() {
    try {
      setBusy(true);
      setError("");

      await notificationService.markAllRead();

      /*
       * Update locally rather than refetching — the rows are already
       * correct, only their read flag changed.
       */
      setNotifications((current) =>
        current.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error("Failed to clear notifications:", err);
      setError(getErrorMessage(err, "Could not clear your notifications."));
    } finally {
      setBusy(false);
    }
  }

  async function handleOpen(notification) {
    if (notification.read === true) return;

    setNotifications((current) =>
      current.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    try {
      await notificationService.markRead(notification.id);
    } catch (err) {
      /*
       * Marking read is a convenience, not the point of the tap — if it
       * fails, leave the optimistic state and let the next load correct
       * it rather than yanking the row back to unread.
       */
      console.error("Failed to mark notification read:", err);
    }
  }

  if (loading) {
    return <Loading label="Loading notifications" />;
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsNoneRounded />
            </Badge>

            <Typography variant="h5" fontWeight={900}>
              Notifications
            </Typography>
          </Stack>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "You're all caught up."}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshRounded />}
            onClick={load}
            sx={{ fontWeight: 700 }}
          >
            Refresh
          </Button>

          {unreadCount > 0 && (
            <Button
              variant="contained"
              startIcon={<DoneAllRounded />}
              onClick={handleMarkAllRead}
              disabled={busy}
              sx={{ fontWeight: 700 }}
            >
              Mark all read
            </Button>
          )}
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          {notifications.length === 0 ? (
            <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
              <NotificationsNoneRounded
                sx={{ fontSize: 44, color: "text.disabled" }}
              />

              <Typography color="text.secondary">
                Nothing yet. Updates about your orders will appear here.
              </Typography>
            </Stack>
          ) : (
            <Stack divider={<Divider />} spacing={0}>
              {notifications.map((notification) => {
                const style =
                  TYPE_STYLES[notification.type] || {
                    icon: NotificationsNoneRounded,
                    color: "default",
                  };

                const Icon = style.icon;
                const unread = notification.read !== true;
                const orderId = orderIdOf(notification);

                return (
                  <Stack
                    key={notification.id}
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                    onClick={() => handleOpen(notification)}
                    sx={{
                      py: 2,
                      px: 1,
                      mx: -1,
                      cursor: unread ? "pointer" : "default",
                      borderRadius: 2,
                      bgcolor: unread ? "action.hover" : "transparent",
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor:
                          style.color === "default"
                            ? "action.selected"
                            : `${style.color}.main`,
                        color:
                          style.color === "default"
                            ? "text.secondary"
                            : "#fff",
                      }}
                    >
                      <Icon fontSize="small" />
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Typography fontWeight={unread ? 800 : 600}>
                          {notification.title || "Update"}
                        </Typography>

                        {unread && (
                          <Chip size="small" color="error" label="New" />
                        )}
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {notification.message}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ mt: 1 }}
                        flexWrap="wrap"
                      >
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(notification.createdAt)}
                        </Typography>

                        {orderId && (
                          <Button
                            component={Link}
                            to={`/orders/${orderId}`}
                            size="small"
                            sx={{ fontWeight: 700 }}
                            onClick={(event) => event.stopPropagation()}
                          >
                            View order
                          </Button>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
