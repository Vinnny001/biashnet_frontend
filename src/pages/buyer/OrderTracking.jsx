import { Alert, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderDetails from "../../components/order/OrderDetails";
import Loading from "../../components/common/Loading";
import { orderService } from "../../services/order.service";
import { getErrorMessage } from "../../utils/errors";

/*
 * Everything before handover. A paid order now advances through
 * PROCESSING -> READY_FOR_DELIVERY -> OUT_FOR_DELIVERY as sellers drop
 * off and logistics sends it out; the buyer keeps the right to cancel
 * throughout, because funds are only released against their completion
 * code when the rider hands the order over. mpesa-api enforces the same
 * list in orderService — this only decides whether to show the button.
 */
const SELF_CANCELLABLE_STATUSES = [
  "PENDING_PAYMENT",
  "PAYMENT_INITIATED",
  "PAID",
  "PROCESSING",
  "READY_FOR_DELIVERY",
  "OUT_FOR_DELIVERY",
];

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadOrder = useCallback(() => {
    setLoading(true);
    orderService
      .get(id)
      .then((payload) => setOrder(payload?.order || null))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  async function handleResolve(decision) {
    try {
      setResolving(true);
      setError("");
      setMessage("");

      await orderService.resolvePartial(id, decision);

      setMessage(
        decision === "cancel"
          ? "Order cancelled — your refund has been requested."
          : "You've accepted the available items. Compliant sellers will be paid and the rest refunded."
      );

      loadOrder();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setResolving(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm("Cancel this order? If it's already been paid, a full refund will be requested.")) {
      return;
    }

    try {
      setCancelling(true);
      setError("");
      setMessage("");

      const result = await orderService.cancel(id);

      setMessage(
        result?.refunded
          ? "Order cancelled — a full refund has been requested."
          : "Order cancelled."
      );

      loadOrder();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  }

  if (loading) return <Loading />;

  const canSelfCancel = SELF_CANCELLABLE_STATUSES.includes(order?.status);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Track order</Typography>

      {message && (
        <Alert severity="success" onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {order?.customerDecisionRequired && (
        <Card sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "warning.main", boxShadow: "none" }}>
          <CardContent>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label="Action needed" color="warning" size="small" />
                <Typography fontWeight={700}>
                  One or more sellers on this order did not drop off their item(s) in time.
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                You can accept delivery of the available items (sellers who complied are paid
                in full, the rest is refunded to you), or cancel the whole order for a full
                refund.
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  disabled={resolving}
                  onClick={() => handleResolve("accept_partial")}
                >
                  Accept available items
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={resolving}
                  onClick={() => handleResolve("cancel")}
                >
                  Cancel order
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {canSelfCancel && !order?.customerDecisionRequired && (
        <Card sx={{ borderRadius: 2.5, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1.5} alignItems={{ sm: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Changed your mind? You can cancel this order as long as it hasn't been fulfilled yet.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                disabled={cancelling}
                onClick={handleCancel}
              >
                {cancelling ? "Cancelling..." : "Cancel order"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      <OrderDetails order={order} />
    </Stack>
  );
}
