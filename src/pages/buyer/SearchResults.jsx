import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductGrid from "../../components/product/ProductGrid";
import SearchBar from "../../components/shared/SearchBar";
import { productService } from "../../services/product.service";
import { normalizeList } from "../../utils/helpers";

export default function SearchResults() {
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const query = params.get("q") || "";

  useEffect(() => {
    productService
      .list({ q: query })
      .then((payload) => setProducts(normalizeList(payload)))
      .catch(() => setProducts([]));
  }, [query]);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Search results</Typography>
      <SearchBar />
      <Typography color="text.secondary">Showing results for {query || "all listings"}.</Typography>
      <ProductGrid products={products} />
    </Stack>
  );
}
