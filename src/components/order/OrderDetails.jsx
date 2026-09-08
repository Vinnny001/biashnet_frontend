import { Divider, Stack, Typography } from "@mui/material";
import { formatCurrency } from "../../utils/formatters";
import Card from "../common/Card";
import OrderTimeline from "./OrderTimeline";

export default function OrderDetails({ order }) {
  if (!order) return null;

  return (
    <Card>
      <Stack spacing={2}>
        <Typography variant="h5">{order.reference || `Order ${order.id || order.orderId}`}</Typography>
        <Divider />
        {(order.items || []).map((item) => (
          <Stack key={item.listingId} direction="row" justifyContent="space-between">
            <div>
              <Typography>{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Qty {item.quantity}
              </Typography>
            </div>
            <Typography>{formatCurrency(item.itemTotal)}</Typography>
          </Stack>
        ))}
        <Divider />
        <Typography variant="h6" color="primary.main">
          Total: {formatCurrency(order.buyerTotal)}
        </Typography>
        <Divider />
        <OrderTimeline status={order.status} />
      </Stack>
    </Card>
  );
}
