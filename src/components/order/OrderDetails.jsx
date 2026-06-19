import { Divider, Stack, Typography } from "@mui/material";
import { formatCurrency } from "../../utils/formatters";
import Card from "../common/Card";
import OrderTimeline from "./OrderTimeline";

export default function OrderDetails({ order }) {
  if (!order) return null;

  return (
    <Card>
      <Stack spacing={2}>
        <Typography variant="h5">{order.reference || "Order details"}</Typography>
        <Typography color="text.secondary">Status: {order.status || "pending"}</Typography>
        <Divider />
        {(order.items || []).map((item) => (
          <Stack key={item.id || item.productId} direction="row" justifyContent="space-between">
            <Typography>{item.name}</Typography>
            <Typography>{formatCurrency(item.price * (item.quantity || 1))}</Typography>
          </Stack>
        ))}
        <Divider />
        <Typography variant="h6" color="primary.main">
          Total: {formatCurrency(order.total)}
        </Typography>
        <OrderTimeline steps={order.timeline || []} />
      </Stack>
    </Card>
  );
}
