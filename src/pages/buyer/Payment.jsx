import {
  Alert,
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { Lock, Payment as PaymentIcon } from "@mui/icons-material";

import { useEffect, useState } from "react";
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
| triggers the STK push (initiatePayment). It never confirms the payment
| itself; that happens asynchronously via M-PESA's callback. Once the
| push is sent, the buyer is pointed at order tracking to watch status.
|
|--------------------------------------------------------------------------
*/

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

  if (loadingOrder) {
    return <Loading label="Loading your order..." />;
  }

  if (paymentStarted) {
    return (
      <Box sx={{ maxWidth: 520, mx: "auto", py: { xs: 2, md: 4 } }}>
        <Card>
          <Stack spacing={2}>
            <Alert severity="success">M-PESA payment request sent successfully.</Alert>

            <Typography variant="h6" fontWeight={700}>
              Check your phone
            </Typography>

            <Typography color="text.secondary">
              An M-PESA prompt has been sent to:
            </Typography>

            <Typography fontWeight={700}>
              {paymentResult?.phone || phone}
            </Typography>

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

            <Alert severity="info">
              Enter your M-PESA PIN on your phone to complete the payment.
            </Alert>

            <Button variant="contained" onClick={() => navigate(`/orders/${orderId}`)}>
              Track my order
            </Button>
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
