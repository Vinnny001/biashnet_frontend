import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "../../utils/formatters";
import Card from "../common/Card";

export default function OrderCard({ order }) {
  const id = order.id || order._id;

  return (
    <Card>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
        <Stack>
          <Typography variant="h6">{order.reference || `Order ${id}`}</Typography>
          <Typography color="text.secondary">{formatDate(order.createdAt)}</Typography>
          <Typography color="primary.main">{formatCurrency(order.total)}</Typography>
        </Stack>
        <Stack alignItems={{ xs: "stretch", sm: "flex-end" }} spacing={1}>
          <Typography>{order.status || "pending"}</Typography>
          <Button component={Link} to={`/orders/${id}`} variant="outlined">
            Track
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
