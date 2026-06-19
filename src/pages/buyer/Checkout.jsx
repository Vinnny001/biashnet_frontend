import { Alert, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import CheckoutForm from "../../components/forms/CheckoutForm";
import Card from "../../components/common/Card";
import { useCart } from "../../hooks/useCart";
import { orderService } from "../../services/order.service";
import { formatCurrency } from "../../utils/formatters";
import { getErrorMessage } from "../../utils/errors";

export default function Checkout() {
  const cart = useCart();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(values) {
    try {
      setError("");
      await orderService.create({ ...values, items: cart.items, total: cart.total });
      cart.clearCart();
      setMessage("Order placed successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Could not place order."));
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Typography variant="h4" sx={{ mb: 2 }}>Checkout</Typography>
        {message ? <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert> : null}
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        <CheckoutForm onSubmit={handleSubmit} />
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <Stack spacing={1}>
            <Typography variant="h6">Order summary</Typography>
            {cart.items.map((item) => (
              <Typography key={item.id} color="text.secondary">
                {item.quantity} x {item.name || item.title}
              </Typography>
            ))}
            <Typography variant="h5" color="primary.main">{formatCurrency(cart.total)}</Typography>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
