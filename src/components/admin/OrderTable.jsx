import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function OrderTable({ orders = [] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id || order._id}>
              <TableCell>{order.reference || order.id || order._id}</TableCell>
              <TableCell>{order.customerName || order.user?.name || "Customer"}</TableCell>
              <TableCell>{formatCurrency(order.total)}</TableCell>
              <TableCell>{order.status || "pending"}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
