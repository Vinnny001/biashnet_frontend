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
import { CheckCircleRounded, LocalShippingRounded } from "@mui/icons-material";

import { logisticsService } from "../../services/logistics.service";
import { getErrorMessage } from "../../utils/errors";

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
  const [loading, setLoading] = useState(true);
  const [busySubOrderId, setBusySubOrderId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [finalOrderId, setFinalOrderId] = useState("");
  const [finalCode, setFinalCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  async function loadPending() {

    try {

      setLoading(true);

      const payload = await logisticsService.listPendingDropoffs();

      setSubOrders(payload?.subOrders || []);

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
          Confirm seller drop-offs at Biashnet, and verify the buyer's code on final delivery.
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
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <CheckCircleRounded color="primary" />
            <Typography fontWeight={800}>Confirm final delivery to buyer</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Once every seller on an order has dropped off (no sub-order still Pending Drop-off
            below), the buyer gives you their completion code on final delivery.
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

      <Divider />

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocalShippingRounded color="primary" />
            <Typography fontWeight={800}>Pending seller drop-offs</Typography>
          </Stack>
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
    </Stack>
  );
}
