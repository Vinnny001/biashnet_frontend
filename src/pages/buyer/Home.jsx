import { Box, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ProductGrid from "../../components/product/ProductGrid";
import SearchBar from "../../components/shared/SearchBar";
import Card from "../../components/common/Card";
import { productService } from "../../services/product.service";
import { normalizeList } from "../../utils/helpers";

const fallbackProducts = [
  { id: "demo-1", name: "Golden Biashnet Starter Pack", price: 2500, category: "products" },
  { id: "demo-2", name: "Featured Seller Service", price: 5000, category: "services" },
  { id: "demo-3", name: "Prime House Listing", price: 45000, category: "houses" },
  { id: "demo-4", name: "Business Advert Slot", price: 1500, category: "adverts" }
];

export default function Home() {
  const [products, setProducts] = useState(fallbackProducts);

  useEffect(() => {
    productService
      .list({ limit: 8 })
      .then((payload) => {
        const list = normalizeList(payload);
        if (list.length) setProducts(list);
      })
      .catch(() => {});
  }, []);

  return (
    <Stack spacing={4} className="fade-in">
      <Box>
        <Typography variant="h3" color="primary.main" gutterBottom>
          Biashnet
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 720, mb: 2 }}>
          Shop products, services, housing, and adverts from verified sellers.
        </Typography>
        <SearchBar />
      </Box>
      <Grid container spacing={2}>
        {["Products", "Services", "Houses", "Adverts"].map((label) => (
          <Grid item xs={6} md={3} key={label}>
            <Card>
              <Typography variant="h6">{label}</Typography>
              <Typography color="text.secondary">Explore listings</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Featured listings
        </Typography>
        <ProductGrid products={products} />
      </Box>
    </Stack>
  );
}
