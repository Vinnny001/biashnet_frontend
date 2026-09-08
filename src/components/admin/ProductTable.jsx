import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { CheckRounded, CloseRounded } from "@mui/icons-material";
import { formatCurrency } from "../../utils/formatters";

const STATUS_COLORS = {
  pending: "warning",
  approved: "success",
  active: "success",
  rejected: "error"
};

export default function ProductTable({ products = [], busyId = null, onModerate }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Status</TableCell>
            {onModerate && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={onModerate ? 5 : 4}>
                <Typography color="text.secondary">No products found.</Typography>
              </TableCell>
            </TableRow>
          )}
          {products.map((product) => {
            const status = product.status || "active";
            const id = product.id || product._id;

            return (
              <TableRow key={id}>
                <TableCell>{product.name || product.title}</TableCell>
                <TableCell>{product.category || "General"}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>
                  <Chip size="small" label={status} color={STATUS_COLORS[status] || "default"} />
                </TableCell>
                {onModerate && (
                  <TableCell>
                    {status === "pending" ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckRounded />}
                          disabled={busyId === id}
                          onClick={() => onModerate(id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CloseRounded />}
                          disabled={busyId === id}
                          onClick={() => onModerate(id, "rejected")}
                        >
                          Reject
                        </Button>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
