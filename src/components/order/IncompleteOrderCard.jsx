import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, IconButton, Stack, Typography, alpha } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import Card from "../common/Card";
import { orderService } from "../../services/order.service";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getErrorMessage } from "../../utils/errors";

/*
|--------------------------------------------------------------------------
| Incomplete Order Card
|--------------------------------------------------------------------------
|
| An order the buyer created but never paid for (PENDING_PAYMENT /
| PAYMENT_INITIATED). Loads its own item-availability detail on mount
| (the plain orders list doesn't include it), lets the buyer remove
| items that are no longer available (or that they simply don't want
| anymore) and resume payment — but never add new items here.
|
|--------------------------------------------------------------------------
*/

export default function IncompleteOrderCard({ order: summary, onChange }) {
  const navigate = useNavigate();
  const orderId = summary.id || summary.orderId;

  const [order, setOrder] = useState(summary);
  const [loading, setLoading] = useState(true);
  const [busyItemId, setBusyItemId] = useState(null);
  const [error, setError] = useState("");
  const [cancelled, setCancelled] = useState(false);

  async function loadOrder() {
    try {
      setLoading(true);
      const payload = await orderService.get(orderId);
      setOrder(payload?.order || summary);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function handleRemoveItem(listingId) {
    try {
      setBusyItemId(listingId);
      setError("");
      const result = await orderService.removeItem(orderId, listingId);

      if (result?.status === "CANCELLED") {
        setCancelled(true);
        onChange?.();
        return;
      }

      await loadOrder();
      onChange?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyItemId(null);
    }
  }

  if (cancelled) {
    return null;
  }

  const items = order?.items || [];
  const hasUnavailableItem = items.some((item) => item.available === false);

  return (
    <Card>
      <Stack spacing={1.5}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Order {orderId}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {formatDate(order?.createdAt)}
            </Typography>
          </Box>
          <Chip label="Payment incomplete" color="warning" size="small" sx={{ alignSelf: { xs: "flex-start", sm: "center" } }} />
        </Stack>

        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {hasUnavailableItem && (
          <Alert severity="warning">
            Some items in this order are no longer available. Remove them before completing payment.
          </Alert>
        )}

        <Stack spacing={1}>
          {items.map((item) => (
            <Stack
              key={item.listingId}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
              sx={{
                py: 1,
                px: 1.5,
                borderRadius: 2,
                bgcolor: item.available === false
                  ? (theme) => alpha(theme.palette.error.main, 0.08)
                  : "action.hover",
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={600} noWrap>
                  {item.title}
                  {item.available === false && (
                    <Chip label="Unavailable" color="error" size="small" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Qty {item.quantity} · {formatCurrency(item.itemTotal)}
                </Typography>
              </Box>

              <IconButton
                aria-label="Remove item"
                onClick={() => handleRemoveItem(item.listingId)}
                disabled={busyItemId === item.listingId || loading}
                size="small"
              >
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
          <Typography fontWeight={700}>Total</Typography>
          <Typography variant="h6" fontWeight={800} color="primary.main">
            {formatCurrency(order?.buyerTotal || 0)}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          disabled={loading || hasUnavailableItem || items.length === 0}
          onClick={() => navigate(`/buyer/payment/${orderId}`)}
        >
          Complete Payment
        </Button>
      </Stack>
    </Card>
  );
}
