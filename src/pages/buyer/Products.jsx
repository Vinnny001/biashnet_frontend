import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FilterForm from "../../components/forms/FilterForm";
import ProductGrid from "../../components/product/ProductGrid";
import Loading from "../../components/common/Loading";
import { productService } from "../../services/product.service";
import { normalizeList } from "../../utils/helpers";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productService
      .list({ category, sort })
      .then((payload) => setProducts(normalizeList(payload)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, sort]);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Products</Typography>
      <FilterForm category={category} sort={sort} onCategoryChange={setCategory} onSortChange={setSort} />
      {loading ? <Loading /> : <ProductGrid products={products} />}
    </Stack>
  );
}
