import {
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatters";

const STATUS_COLOR = {
  approved: "success",
  active: "success",
  pending: "warning",
  rejected: "error",
};

export default function ProductTable({ products = [], onDelete }) {
  if (!products.length) {
    return <Typography color="text.secondary">No products yet.</Typography>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Image</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Stock</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {products.map((product) => {
          const id = product.id || product._id;
          const image =
            product.images?.[0]?.thumb ||
            product.images?.[0]?.full ||
            product.image ||
            product.imageUrl;

          return (
            <TableRow key={id}>
              <TableCell>
                {image ? (
                  <img
                    src={image}
                    alt={product.title || product.name}
                    width={48}
                    height={48}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                ) : null}
              </TableCell>
              <TableCell>{product.title || product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>{product.stock ?? "—"}</TableCell>
              <TableCell>
                <Chip
                  label={product.status || "pending"}
                  color={STATUS_COLOR[product.status] || "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button
                    component={Link}
                    to={`/seller/products/${id}/edit`}
                    size="small"
                  >
                    Edit
                  </Button>
                  {onDelete ? (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onDelete(id)}
                    >
                      Delete
                    </Button>
                  ) : null}
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}