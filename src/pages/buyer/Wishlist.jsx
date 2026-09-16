import { Box, Button, Stack, Typography } from "@mui/material";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductGrid from "../../components/product/ProductGrid";
import ProductSkeleton from "../../components/product/ProductSkeleton";

import { wishlistService } from "../../services/wishlist.service";
import { useWishlist } from "../../hooks/useWishlist";
import { normalizeList } from "../../utils/helpers";

/*
 * The listings this buyer has liked. Only a buyer account has likes, so a
 * visitor is asked to sign in and anyone else is told plainly that likes
 * belong to the buyer account.
 */
export default function Wishlist() {
  const { canLike, likedIds } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!canLike) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await wishlistService.list();
      setProducts(normalizeList(response));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [canLike]);

  useEffect(() => {
    load();
    // Reload when a like is added or removed elsewhere (a card's heart).
  }, [load, likedIds.length]);

  if (!canLike) {
    return (
      <Empty
        title="Sign in to see your likes"
        message="Likes are saved to your buyer account, so they're waiting for you on every device."
        action={{ to: "/login", label: "Sign in" }}
      />
    );
  }

  if (loading) {
    return (
      <Box p={2}>
        <ProductSkeleton count={8} />
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Empty
        title="Nothing liked yet"
        message="Tap the heart on any listing and it will be kept here."
        action={{ to: "/products", label: "Browse products" }}
      />
    );
  }

  return (
    <Box sx={{ px: { xs: 1, sm: 2 }, py: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={800}>
          Your likes
        </Typography>

        <Typography color="text.secondary" variant="body2">
          {products.length} {products.length === 1 ? "listing" : "listings"}
        </Typography>

        <ProductGrid products={products} />
      </Stack>
    </Box>
  );
}

function Empty({ title, message, action }) {
  return (
    <Stack spacing={2} alignItems="center" sx={{ py: 8, px: 3, textAlign: "center" }}>
      <FavoriteBorderRoundedIcon sx={{ fontSize: 56, color: "text.disabled" }} />

      <Typography variant="h6" fontWeight={800}>
        {title}
      </Typography>

      <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
        {message}
      </Typography>

      <Button component={Link} to={action.to} variant="contained" sx={{ fontWeight: 700 }}>
        {action.label}
      </Button>
    </Stack>
  );
}
