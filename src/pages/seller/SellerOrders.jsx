import { Stack, Typography } from "@mui/material";
import OrderTable from "../../components/admin/OrderTable";

export default function SellerOrders() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Seller orders</Typography>
      <OrderTable orders={[]} />
    </Stack>
  );
}
