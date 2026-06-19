import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderDetails from "../../components/order/OrderDetails";
import Loading from "../../components/common/Loading";
import { orderService } from "../../services/order.service";

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.get(id).then((payload) => setOrder(payload?.data || payload)).catch(() => setOrder(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Track order</Typography>
      <OrderDetails order={order} />
    </Stack>
  );
}
