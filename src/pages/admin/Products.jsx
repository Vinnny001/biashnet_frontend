import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ProductTable from "../../components/admin/ProductTable";
import Loading from "../../components/common/Loading";
import { productService } from "../../services/product.service";
import { normalizeList } from "../../utils/helpers";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.list().then((payload) => setProducts(normalizeList(payload))).catch(() => setProducts([])).finally(() => setLoading(false));
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Products</Typography>
      {loading ? <Loading /> : <ProductTable products={products} />}
    </Stack>
  );
}
