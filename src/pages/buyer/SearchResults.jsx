import { Alert, CircularProgress, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import ProductGrid from "../../components/product/ProductGrid";
import SearchBar from "../../components/shared/SearchBar";

import { useProducts } from "../../hooks/useProducts";
import { useServerWaking } from "../../hooks/useServerWaking";

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const { products, loading, error, reload } = useProducts({ q: query });

  const serverWaking = useServerWaking();

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Search results</Typography>
      <SearchBar />

      <Typography color="text.secondary">
        Showing results for {query || "all listings"}.
      </Typography>

      {serverWaking && loading && (
        <Alert severity="info" icon={<CircularProgress size={18} />}>
          Waking up the marketplace — this can take up to a minute after a
          quiet spell. Hang on, we'll keep trying.
        </Alert>
      )}

      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onRetry={reload}
      />
    </Stack>
  );
}
