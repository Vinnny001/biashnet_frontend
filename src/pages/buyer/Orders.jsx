import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import OrderList from "../../components/order/OrderList";
import { orderService } from "../../services/order.service";
import { normalizeList } from "../../utils/helpers";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.list().then((payload) => setOrders(normalizeList(payload))).catch(() => setOrders([]));
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">My orders</Typography>
      <OrderList orders={orders} />
    </Stack>
  );
}
