import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  CheckCircleRounded,
  Inventory2Rounded,
  LocalShippingRounded,
} from "@mui/icons-material";

import { logisticsService } from "../../services/logistics.service";
import { getErrorMessage } from "../../utils/errors";

/*
 * deliveryAddress is an object on the order — checkout writes
 * { location, phone, notes } and older records also carry name/landmark.
 * A few legacy orders have no address at all, and at least one shape in
 * the wild is a plain string, so every case is normalised here: rendering
 * the raw value would throw "Objects are not valid as a React child" and
 * blank the page.
 */
function formatAddress(value) {

  if (!value) return { line: "—", notes: null, phone: null };

  if (typeof value === "string") {
    return { line: value, notes: null, phone: null };
  }

  const line =
    [value.name, value.location, value.landmark]
      .map((part) => (part == null ? "" : String(part).trim()))
      .filter(Boolean)
      .join(", ") || "—";

  return {
    line,
    notes: value.notes ? String(value.notes) : null,
    phone: value.phone ? String(value.phone) : null,
  };
}

function formatDeadline(value) {

  if (!value) return "—";

  const date = value?._seconds
    ? new Date(value._seconds * 1000)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  const now = Date.now();
  const diffMs = date.getTime() - now;
  const overdue = diffMs < 0;
  const hours = Math.abs(Math.round(diffMs / (60 * 60 * 1000)));

  return `${date.toLocaleString()} (${overdue ? "overdue by" : "in"} ${hours}h)`;
}

export default function Logistics() {

  const [subOrders, setSubOrders] = useState([]);
  const [readyOrders, setReadyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busySubOrderId, setBusySubOrderId] = useState(null);
  const [busyOrderId, setBusyOrderId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [finalOrderId, setFinalOrderId] = useState("");
  const [finalCode, setFinalCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  async function loadPending() {

    try {

      setLoading(true);

      /*
       * The two queues are independent: a drop-off failing to load
       * shouldn't hide orders that are already waiting to go out.
       */
      const [pending, ready] = await Promise.allSettled([
        logisticsService.listPendingDropoffs(),
        logisticsService.listReadyForDelivery(),
      ]);

      if (pending.status === "fulfilled") {
        setSubOrders(pending.value?.subOrders || []);
      }

      if (ready.status === "fulfilled") {
        setReadyOrders(ready.value?.orders || []);
      }

      const failed = [pending, ready].find((r) => r.status === "rejected");

      if (failed) {
        setError(getErrorMessage(failed.reason));
      }

    } catch (err) {

      setError(getErrorMessage(err));

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {

    loadPending();
  }, []);

  async function handleConfirm(subOrderId) {

    try {

      setBusySubOrderId(subOrderId);

      setError("");

      setMessage("");

      await logisticsService.confirmDropoff(subOrderId);

      setMessage(`Drop-off confirmed for ${subOrderId}.`);

      loadPending();

    } catch (err) {

      setError(getErrorMessage(err));

    } finally {

      setBusySubOrderId(null);
    }
  }

  async function handleDispatch(orderId) {

    try {

      setBusyOrderId(orderId);

      setError("");

      setMessage("");

      await logisticsService.markOutForDelivery(orderId);

      setMessage(
        `${orderId} is out for delivery. The buyer has been notified to have their completion code ready.`
      );

      loadPending();

    } catch (err) {

      setError(getErrorMessage(err));

    } finally {

      setBusyOrderId(null);
    }
  }

  async function handleVerifyFinalDelivery(event) {

    event.preventDefault();

    try {

      setVerifying(true);

      setError("");

      setMessage("");

      const result = await logisticsService.verifyCompletionCode(
        finalOrderId.trim(),
        finalCode.trim()
      );

      setMessage(
        result?.message ||
          "Order completed — every ready sub-order has been released to its seller."
      );

      setFinalOrderId("");

      setFinalCode("");

    } catch (err) {

      setError(getErrorMessage(err));

    } finally {

      setVerifying(false);
    }
  }

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: "1.7rem", md: "2.1rem" } }}>
          Logistics
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Step 1 — confirm each seller's drop-off. Step 2 — send the order out once
          they're all in. Step 3 — verify the buyer's code on handover, which releases
          the sellers' funds.
        </Typography>
      </Box>

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

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center">
            <Inventory2Rounded color="primary" />
            <Typography fontWeight={800}>1 · Pending seller drop-offs</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Sellers bringing item(s) to Biashnet. Confirm each one as it arrives.
          </Typography>
        </CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sub-order</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Seller</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && subOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary">Nothing pending drop-off.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {subOrders.map((subOrder) => (
                <TableRow key={subOrder.subOrderId}>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                    {subOrder.subOrderId}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                    {subOrder.orderId}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                    {subOrder.sellerId}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={formatDeadline(subOrder.dropoffDeadline)}
                      color={
                        subOrder.dropoffDeadline &&
                        new Date(
                          subOrder.dropoffDeadline?._seconds
                            ? subOrder.dropoffDeadline._seconds * 1000
                            : subOrder.dropoffDeadline
                        ).getTime() < Date.now()
                          ? "error"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      disabled={busySubOrderId === subOrder.subOrderId}
                      onClick={() => handleConfirm(subOrder.subOrderId)}
                    >
                      Confirm drop-off
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocalShippingRounded color="primary" />
            <Typography fontWeight={800}>2 · Ready to send out</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Every seller on these orders has dropped off. Sending one out marks it
            Out for delivery on the buyer's tracker and tells them to have their
            completion code ready. No money moves yet.
          </Typography>
        </CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Sellers</TableCell>
                <TableCell>Deliver to</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && readyOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary">
                      Nothing waiting to go out.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {readyOrders.map((order) => {
                const itemCount = Array.isArray(order.items) ? order.items.length : 0;

                const titles = Array.isArray(order.items)
                  ? order.items
                      .map((item) => item.title || item.name)
                      .filter(Boolean)
                      .join(", ")
                  : "";

                const dispatched = order.status === "OUT_FOR_DELIVERY";

                const address = formatAddress(order.deliveryAddress);

                return (
                  <TableRow key={order.orderId}>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                      {order.orderId}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {titles || `${itemCount} item${itemCount === 1 ? "" : "s"}`}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.sellerCount}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {address.line}
                      </Typography>

                      {(address.phone || order.buyerPhone) && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {address.phone || order.buyerPhone}
                        </Typography>
                      )}

                      {address.notes && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Note: {address.notes}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {dispatched ? (
                        <Chip size="small" color="info" label="Out for delivery" />
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          disabled={busyOrderId === order.orderId}
                          onClick={() => handleDispatch(order.orderId)}
                        >
                          Send out for delivery
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Divider />

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <CheckCircleRounded color="primary" />
            <Typography fontWeight={800}>3 · Confirm final delivery to buyer</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            On handover the buyer gives you their completion code. Verifying it
            completes the order and releases each seller's funds — so only enter a
            code the buyer has actually given you in person.
          </Typography>
          <Box component="form" onSubmit={handleVerifyFinalDelivery}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-end" }}>
              <TextField
                label="Order ID"
                required
                value={finalOrderId}
                onChange={(e) => setFinalOrderId(e.target.value)}
                sx={{ minWidth: 260 }}
              />
              <TextField
                label="Buyer's completion code"
                required
                inputProps={{ maxLength: 6, inputMode: "numeric" }}
                value={finalCode}
                onChange={(e) => setFinalCode(e.target.value)}
              />
              <Button type="submit" variant="contained" disabled={verifying}>
                {verifying ? "Verifying..." : "Verify & Complete"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
