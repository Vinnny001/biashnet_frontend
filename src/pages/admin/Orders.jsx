import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import OrderTable from "../../components/admin/OrderTable";
import Loading from "../../components/common/Loading";
import { orderService } from "../../services/order.service";
import { normalizeList } from "../../utils/helpers";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.list().then((payload) => setOrders(normalizeList(payload))).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Orders</Typography>
      {loading ? <Loading /> : <OrderTable orders={orders} />}
    </Stack>
  );
}
