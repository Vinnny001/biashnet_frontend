import {
  Chip,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { formatCurrency, formatDate } from "../../utils/formatters";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

function getOrderStatus(order) {
  return order.orderStatus || order.status || "pending";
}

function getBuyerName(order) {
  return order.customerName || order.buyerName || "Customer";
}

const STATUS_COLOR = {
  delivered: "success",
  cancelled: "error",
  shipped: "info",
  processing: "warning",
};

export default function OrderTable({ orders = [], sellerId, onStatusChange }) {
  if (!orders.length) {
    return <Typography color="text.secondary">No orders yet.</Typography>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Order</TableCell>
          <TableCell>Customer</TableCell>
          <TableCell>Items</TableCell>
          <TableCell>Total</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {orders.map((order) => {
          const id = order.id || order._id;
          const myItems = sellerId
            ? (order.items || []).filter((item) => item.sellerId === sellerId)
            : order.items || [];

          const myTotal = myItems.reduce(
            (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
            0
          );

          const status = getOrderStatus(order);

          return (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>{getBuyerName(order)}</TableCell>
              <TableCell>
                {myItems.map((item) => (
                  <Typography key={item.id || item.productId} variant="body2">
                    {item.title || item.name} × {item.quantity || 1}
                  </Typography>
                ))}
              </TableCell>
              <TableCell>{formatCurrency(myTotal)}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>
                {onStatusChange ? (
                  <Select
                    size="small"
                    value={status}
                    onChange={(event) => onStatusChange(id, event.target.value)}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  <Chip label={status} color={STATUS_COLOR[status] || "default"} size="small" />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}