import { Button, Divider, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card";
import ProductImage from "../../components/product/ProductImage";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatters";

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Cart</Typography>
      <Card>
        <Stack spacing={2}>
          {items.length ? (
            items.map((item) => (
              <Stack
                key={item.id}
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <ProductImage src={item.image} alt={item.name || item.title} size={80} />
                  <div>
                    <Typography variant="h6">{item.name || item.title}</Typography>
                    <Typography color="text.secondary">{formatCurrency(item.price)}</Typography>
                  </div>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                  <Button disabled>{item.quantity}</Button>
                  <Button variant="outlined" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                  <Button color="error" onClick={() => removeItem(item.id)}>Remove</Button>
                </Stack>
              </Stack>
            ))
          ) : (
            <Typography color="text.secondary">Your cart is empty.</Typography>
          )}
          <Divider />
          <Typography variant="h5" color="primary.main">Total: {formatCurrency(total)}</Typography>
          <Button component={Link} to="/checkout" variant="contained" disabled={!items.length}>
            Checkout
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}