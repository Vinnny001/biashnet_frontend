import {
  Box,
  Stack,
  Typography,
} from "@mui/material";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductSearch from "../../components/product/ProductSearch";
import ProductCount from "../../components/product/ProductCount";
import ProductSort from "../../components/product/ProductSort";
import ProductGrid from "../../components/product/ProductGrid";
import ProductSkeleton from "../../components/product/ProductSkeleton";

import { productService } from "../../services/product.service";
import { normalizeList } from "../../utils/helpers";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const [search, setSearch] = useState(query);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [sort, setSort] = useState("latest");

  useEffect(() => {
    setLoading(true);

    productService
      .list({
        q: query,
        sort,
      })
      .then((res) => setProducts(normalizeList(res)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query, sort]);

  const filteredProducts = useMemo(() => {
    if (!query) return [];

    return products.filter((product) =>
      `${product.name || ""}
       ${product.title || ""}
       ${product.description || ""}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [products, query]);

  const handleSearch = (value) => {
    setSearch(value);
    setSearchParams({ q: value });
  };

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        px: {
          xs: 1,
          sm: 2,
        },
        py: 2,
      }}
    >
      <Stack spacing={3}>

        <ProductSearch
          value={search}
          onChange={handleSearch}
        />

        <Typography
          variant="h5"
          fontWeight={700}
        >
          Search Results
        </Typography>

        <Typography
          color="text.secondary"
        >
          Results for "{query}"
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <ProductCount
            count={filteredProducts.length}
            category="Search"
          />

          <ProductSort
            value={sort}
            onChange={setSort}
          />
        </Box>

        {loading ? (
          <ProductSkeleton count={12} />
        ) : filteredProducts.length ? (
          <ProductGrid
            products={filteredProducts}
          />
        ) : (
          <Box
            sx={{
              py: 10,
              textAlign: "center",
            }}
          >
            <SearchOffRoundedIcon
              sx={{
                fontSize: 80,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              No results found
            </Typography>

            <Typography
              color="text.secondary"
            >
              Try another keyword or browse a different category.
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}