import { useEffect, useState } from "react";
import { Alert, Stack, Typography } from "@mui/material";
import Loading from "../../components/common/Loading";
import OrderTable from "../../components/seller/OrderTable";
import { orderService } from "../../services/order.service";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errors";

export default function SellerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await orderService.list();
        const data = response?.data?.data || response?.data || [];

        if (isMounted) {
          setOrders(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    try {
      setError("");
      await orderService.update(orderId, { status: newStatus });

      setOrders((current) =>
        current.map((order) =>
          (order.id || order._id) === orderId
            ? { ...order, status: newStatus, orderStatus: newStatus }
            : order
        )
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Seller orders</Typography>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Loading label="Loading orders..." />
      ) : (
        <OrderTable
          orders={orders}
          sellerId={user?.id || user?.uid}
          onStatusChange={handleStatusChange}
        />
      )}
    </Stack>
  );
}