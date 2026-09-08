import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { CheckCircle, ErrorOutline, Lock, Payment as PaymentIcon } from "@mui/icons-material";

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import Input from "../../components/common/Input";

import { getCheckout, initiatePayment } from "../../services/checkout.Service";

import { formatCurrency } from "../../utils/formatters";
import { getErrorMessage } from "../../utils/errors";


/*
|--------------------------------------------------------------------------
| Payment Page
|--------------------------------------------------------------------------
|
| Reached after Checkout creates the order (createCheckout) but before
| the buyer has actually paid — this page collects the M-PESA number and
| triggers the STK push (initiatePayment). Once the push is sent, it
| polls the order itself for paymentStatus so the buyer sees the real
| outcome (paid / failed) live, instead of a static "check your phone"
| screen with no idea what actually happened.
|
|--------------------------------------------------------------------------
*/

const POLL_INTERVAL_MS = 4000;
const MAX_POLL_ATTEMPTS = 30; // ~2 minutes

export default function Payment() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.checkout || null);
  const [loadingOrder, setLoadingOrder] = useState(!location.state?.checkout);

  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [paymentStarted, setPaymentStarted] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Live status: "waiting" | "completed" | "failed" | "timeout"
  |--------------------------------------------------------------------------
  */

  const [pollStatus, setPollStatus] = useState("waiting");
  const pollAttempts = useRef(0);
  const pollTimer = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Load the order if we landed here directly (refresh, shared link) —
  | location.state is only populated when Checkout itself navigated here.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (order || !orderId) return;

    let cancelled = false;
    setLoadingOrder(true);

    getCheckout(orderId)
      .then((response) => {
        if (!cancelled) setOrder(response?.order || response);
      })
      .catch(() => {
        if (!cancelled) setOrder(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingOrder(false);
      });

    return () => {
      cancelled = true;
    };
  }, [order, orderId]);

  /*
  |--------------------------------------------------------------------------
  | Poll for the real payment outcome once the STK push has been sent.
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!paymentStarted) return;

    function stopPolling() {
      if (pollTimer.current) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
    }

    async function poll() {
      pollAttempts.current += 1;

      try {
        const response = await getCheckout(orderId);
        const latestOrder = response?.order || response;

        if (latestOrder) {
          setOrder(latestOrder);

          if (latestOrder.paymentStatus === "COMPLETED") {
            setPollStatus("completed");
            stopPolling();
            return;
          }

          if (["FAILED", "CANCELLED"].includes(latestOrder.paymentStatus)) {
            setPollStatus("failed");
            stopPolling();
            return;
          }
        }
      } catch {
        // A transient fetch failure shouldn't stop polling — try again.
      }

      if (pollAttempts.current >= MAX_POLL_ATTEMPTS) {
        setPollStatus("timeout");
        stopPolling();
      }
    }

    poll();
    pollTimer.current = setInterval(poll, POLL_INTERVAL_MS);

    return stopPolling;
  }, [paymentStarted, orderId]);

  async function handlePay(event) {
    event.preventDefault();

    if (submitting) return;

    const cleanPhone = phone.trim().replace(/\s+/g, "").replace(/-/g, "");
    if (!/^(\+254|254|07|01)\d{8,9}$/.test(cleanPhone)) {
      setError("Enter a valid Kenyan M-PESA phone number.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const result = await initiatePayment({ orderId, phoneNumber: cleanPhone });

      setPaymentResult(result);
      pollAttempts.current = 0;
      setPollStatus("waiting");
      setPaymentStarted(true);

      /*
      Checkout already marked these cart items as checked-out
      (status: "pending", hidden from the active cart but never
      deleted — Checkout.jsx does this the moment the order is
      created). Nothing left to do to the cart here.
      */
    } catch (err) {
      setError(getErrorMessage(err, "Unable to start payment. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setPaymentStarted(false);
    setPollStatus("waiting");
    setError("");
  }

  if (loadingOrder) {
    return <Loading label="Loading your order..." />;
  }

  if (paymentStarted) {
    return (
      <Box sx={{ maxWidth: 520, mx: "auto", py: { xs: 2, md: 4 } }}>
        <Card>
          <Stack spacing={2}>
            {pollStatus === "waiting" && (
              <>
                <Alert severity="success">M-PESA payment request sent successfully.</Alert>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CircularProgress size={22} />
                  <Typography variant="h6" fontWeight={700}>
                    Waiting for confirmation...
                  </Typography>
                </Stack>

                <Typography color="text.secondary">
                  An M-PESA prompt has been sent to:
                </Typography>

                <Typography fontWeight={700}>
                  {paymentResult?.phone || phone}
                </Typography>

                <Alert severity="info">
                  Enter your M-PESA PIN on your phone to complete the payment. This page will
                  update automatically once it's confirmed.
                </Alert>
              </>
            )}

            {pollStatus === "completed" && (
              <>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CheckCircle color="success" fontSize="large" />
                  <Typography variant="h6" fontWeight={700}>
                    Payment successful
                  </Typography>
                </Stack>
                <Alert severity="success">
                  Your payment has been confirmed. Thank you for shopping with Biashnet!
                </Alert>
              </>
            )}

            {pollStatus === "failed" && (
              <>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <ErrorOutline color="error" fontSize="large" />
                  <Typography variant="h6" fontWeight={700}>
                    Payment did not go through
                  </Typography>
                </Stack>
                <Alert severity="error">
                  The M-PESA request failed or was cancelled. Nothing has been charged — you can
                  try again below.
                </Alert>
              </>
            )}

            {pollStatus === "timeout" && (
              <Alert severity="warning">
                Still waiting on confirmation from M-PESA. If you completed the prompt on your
                phone, this can take a little longer to reflect — check your order history in a
                moment.
              </Alert>
            )}

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography>Order ID</Typography>
              <Typography fontWeight={700} sx={{ wordBreak: "break-all", textAlign: "right" }}>
                {orderId}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography>Amount</Typography>
              <Typography fontWeight={800}>
                {formatCurrency(paymentResult?.amount || order?.buyerTotal || 0)}
              </Typography>
            </Stack>

            {pollStatus === "failed" ? (
              <Stack direction="row" spacing={1.5}>
                <Button variant="contained" onClick={handleRetry}>
                  Try again
                </Button>
                <Button variant="outlined" onClick={() => navigate("/orders")}>
                  View my orders
                </Button>
              </Stack>
            ) : (
              <Button variant="contained" onClick={() => navigate("/orders")}>
                {pollStatus === "completed" ? "View my orders" : "Track my order"}
              </Button>
            )}
          </Stack>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 520, mx: "auto", py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Payment
          </Typography>
          <Typography color="text.secondary">
            Enter the M-PESA number to receive the payment prompt on.
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Card>
          <Stack component="form" spacing={2} onSubmit={handlePay}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PaymentIcon />
              <Typography variant="h6" fontWeight={700}>
                M-PESA payment
              </Typography>
            </Stack>

            <Divider />

            {order && (
              <>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>Order ID</Typography>
                  <Typography fontWeight={700} sx={{ wordBreak: "break-all", textAlign: "right" }}>
                    {orderId}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight={800} color="primary.main">
                    {formatCurrency(order.buyerTotal || 0)}
                  </Typography>
                </Stack>

                <Divider />
              </>
            )}

            <Input
              label="M-PESA phone number"
              type="tel"
              placeholder="0712345678"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={submitting}
              required
            />

            <Alert severity="info" icon={<Lock />}>
              An M-PESA prompt will be sent to this number to complete your payment.
            </Alert>

            <Button type="submit" variant="contained" size="large" disabled={submitting}>
              {submitting ? "Sending M-PESA request..." : "Pay with M-PESA"}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
