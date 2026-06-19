import { Stack, Typography } from "@mui/material";
import OrderCard from "./OrderCard";

export default function OrderList({ orders = [] }) {
  if (!orders.length) return <Typography color="text.secondary">No orders found.</Typography>;

  return (
    <Stack spacing={2}>
      {orders.map((order) => (
        <OrderCard key={order.id || order._id} order={order} />
      ))}
    </Stack>
  );
}
