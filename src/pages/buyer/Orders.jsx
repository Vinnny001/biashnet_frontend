import { useCallback, useEffect, useMemo, useState } from "react";
import { Divider, Stack, Typography } from "@mui/material";
import OrderList from "../../components/order/OrderList";
import IncompleteOrderCard from "../../components/order/IncompleteOrderCard";
import { orderService } from "../../services/order.service";
import { normalizeList } from "../../utils/helpers";

const INCOMPLETE_STATUSES = ["PENDING_PAYMENT", "PAYMENT_INITIATED"];

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = useCallback(() => {
    orderService
      .list()
      .then((payload) => setOrders(normalizeList(payload)))
      .catch(() => setOrders([]));
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const incompleteOrders = useMemo(
    () => orders.filter((order) => INCOMPLETE_STATUSES.includes(order.status)),
    [orders]
  );

  const otherOrders = useMemo(
    () => orders.filter((order) => !INCOMPLETE_STATUSES.includes(order.status)),
    [orders]
  );

  return (
    <Stack spacing={3}>
      <Typography variant="h4">My orders</Typography>

      {incompleteOrders.length > 0 && (
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            Needs your action
          </Typography>
          {incompleteOrders.map((order) => (
            <IncompleteOrderCard key={order.id || order.orderId} order={order} onChange={loadOrders} />
          ))}
        </Stack>
      )}

      {incompleteOrders.length > 0 && otherOrders.length > 0 && <Divider />}

      {(otherOrders.length > 0 || incompleteOrders.length === 0) && (
        <Stack spacing={2}>
          {incompleteOrders.length > 0 && (
            <Typography variant="h6" fontWeight={700}>
              Order history
            </Typography>
          )}
          <OrderList orders={otherOrders} />
        </Stack>
      )}
    </Stack>
  );
}
