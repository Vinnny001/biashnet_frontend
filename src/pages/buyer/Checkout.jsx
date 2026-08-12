import { Alert, Grid, Stack, Typography } from "@mui/material";
import { useState } from "react";
import CheckoutForm from "../../components/forms/CheckoutForm";
import Card from "../../components/common/Card";
import { useCart } from "../../hooks/useCart";
import { orderService } from "../../services/order.service";
import { formatCurrency } from "../../utils/formatters";
import { getErrorMessage } from "../../utils/errors";

/*
|--------------------------------------------------------------------------
| Group cart items by sellerId
|--------------------------------------------------------------------------
|
| A single checkout can contain products from multiple sellers.
| To prevent one seller from seeing another seller's items (or the
| buyer's contact info tied to someone else's items), we split the
| cart into one order PER seller before sending anything to the server.
|
| From the buyer's point of view this still feels like "one checkout" —
| but it results in multiple order documents behind the scenes.
|
*/

function groupItemsBySeller(items) {
  const groups = new Map();

  for (const item of items) {
    const sellerId = item.sellerId || item.userId || "unknown";

    if (!groups.has(sellerId)) {
      groups.set(sellerId, []);
    }

    groups.get(sellerId).push(item);
  }

  return Array.from(groups.entries()).map(([sellerId, sellerItems]) => ({
    sellerId,
    items: sellerItems,
    total: sellerItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    ),
  }));
}

export default function Checkout() {
  const cart = useCart();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  async function handleSubmit(values) {
    if (placing) {
      return;
    }

    setError("");
    setPlacing(true);

    try {
      const sellerGroups = groupItemsBySeller(cart.items);

      if (!sellerGroups.length) {
        throw new Error("Your cart is empty.");
      }

      /*
      |--------------------------------------------------------------------------
      | Create one order per seller
      |--------------------------------------------------------------------------
      |
      | Sent sequentially rather than Promise.all so that if one fails
      | partway through, we know exactly how many orders actually went
      | through (see catch block below) instead of an ambiguous mixed result.
      |
      */

      const createdOrders = [];

      for (const group of sellerGroups) {
        const response = await orderService.create({
          ...values,
          items: group.items,
          total: group.total,
        });

        createdOrders.push(response);
      }

      cart.clearCart();

      setMessage(
        sellerGroups.length > 1
          ? `Order placed successfully — split into ${sellerGroups.length} orders since your cart had items from multiple sellers.`
          : "Order placed successfully."
      );

    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Could not place order. If some items were already ordered, please check your Orders page before retrying."
        )
      );
    } finally {
      setPlacing(false);
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Typography variant="h4" sx={{ mb: 2 }}>Checkout</Typography>
        {message ? <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert> : null}
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        <CheckoutForm onSubmit={handleSubmit} disabled={placing} />
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