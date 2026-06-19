import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ProductTable from "../../components/admin/ProductTable";

export default function MyProducts() {
  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">My products</Typography>
        <Button component={Link} to="/seller/products/new" variant="contained">Add product</Button>
      </Stack>
      <ProductTable products={[]} />
    </Stack>
  );
}
