// pages/Product/ProductDetails.jsx
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  Avatar,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import ProductGallery from "../../components/product/ProductGallery";
import ProductReviews from "../../components/product/ProductReviews";
import { useCart } from "../../hooks/useCart";
import { productService } from "../../services/product.service";
import { formatCurrency } from "../../utils/formatters";

function useCountdown(targetSeconds) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!targetSeconds) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [targetSeconds]);

  if (!targetSeconds) return null;
  const diff = targetSeconds * 1000 - now;
  if (diff <= 0) return null;

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

export default function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([productService.get(id), productService.reviews(id)])
      .then(([productResult, reviewResult]) => {
        if (productResult.status === "fulfilled") {
          const payload = productResult.value;
          const product = payload?.data?.data ?? payload?.data ?? payload;
          setProduct(product?.id ? product : null);
        } else {
          console.error("Failed to load product:", productResult.reason);
        }

        if (reviewResult.status === "fulfilled") {
          const payload = reviewResult.value;
          const list = payload?.data?.data ?? payload?.data ?? payload;
          setReviews(Array.isArray(list) ? list : []);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ADD THIS — fires once the product has loaded
  useEffect(() => {
    if (product?.id) {
      productService.trackView(product.id).catch(() => {});
    }
  }, [product?.id]);

  const isFlashSale = product?.flashSale && product?.flashSalePrice;
  const countdown = useCountdown(product?.flashSaleEnd?._seconds);

  const displayPrice = isFlashSale ? product.flashSalePrice : product?.price;
  const showMarkedPrice =
    product?.markedPrice && product.markedPrice > displayPrice;

  const savingsPct = useMemo(() => {
    if (!showMarkedPrice) return null;
    return Math.round(
      ((product.markedPrice - displayPrice) / product.markedPrice) * 100
    );
  }, [product, displayPrice, showMarkedPrice]);

  if (loading) return <Loading />;
  if (!product)
    return <Typography color="text.secondary">Product not found.</Typography>;

  const inStock = (product.stock ?? 0) > 0;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <ProductGallery images={product.images} alt={product.title} />
      </Grid>

      <Grid item xs={12} md={6}>
        <Card
          sx={{
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 3,
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {product.category && (
                <Chip
                  label={product.category}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
              {product.condition && (
                <Chip
                  label={product.condition}
                  size="small"
                  variant="outlined"
                />
              )}
              {isFlashSale && (
                <Chip
                  label="⚡ Flash Sale"
                  size="small"
                  color="error"
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Stack>

            <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
              {product.title}
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="baseline" flexWrap="wrap">
              <Typography variant="h4" fontWeight={800} color="primary.main">
                {formatCurrency(displayPrice)}
              </Typography>
              {showMarkedPrice && (
                <Typography
                  variant="h6"
                  sx={{ textDecoration: "line-through" }}
                  color="text.secondary"
                >
                  {formatCurrency(product.markedPrice)}
                </Typography>
              )}
              {savingsPct > 0 && (
                <Chip
                  label={`Save ${savingsPct}%`}
                  size="small"
                  color="success"
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Stack>

            {isFlashSale && countdown && (
              <Typography variant="body2" color="error.main" fontWeight={600}>
                Flash sale ends in {countdown}
              </Typography>
            )}

            <Chip
              label={inStock ? `In stock — ${product.stock} left` : "Out of stock"}
              size="small"
              color={inStock ? "success" : "default"}
              variant="outlined"
              sx={{ width: "fit-content" }}
            />

            <Divider />

            <Typography color="text.secondary" whiteSpace="pre-line">
              {product.description}
            </Typography>

            <Stack direction="row" spacing={1} color="text.secondary">
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">{product.location}</Typography>
              <Box flex={1} />
              <VisibilityIcon fontSize="small" />
              <Typography variant="body2">{product.views ?? 0} views</Typography>
            </Stack>

            <Button
              variant="contained"
              size="large"
              disabled={!inStock}
              onClick={() => addItem(product)}
              sx={{
                py: 1.4,
                borderRadius: 2,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {inStock ? "Add to cart" : "Out of stock"}
            </Button>

            <Divider />

            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Avatar src={product.sellerPhoto || undefined} sx={{ width: 48, height: 48 }}>
                {product.sellerName?.[0]}
              </Avatar>
              <Box flex={1}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography fontWeight={700}>{product.sellerName}</Typography>
                  <VerifiedIcon sx={{ fontSize: 16 }} color="primary" />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Seller
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                {product.sellerPhone && (
                  <IconButton
                    component="a"
                    href={`tel:${product.sellerPhone}`}
                    sx={{ bgcolor: "background.paper" }}
                  >
                    <PhoneIcon fontSize="small" />
                  </IconButton>
                )}
                {product.sellerWhatsapp && (
                  <IconButton
                    component="a"
                    href={`https://wa.me/${product.sellerWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ bgcolor: "background.paper", color: "#25D366" }}
                  >
                    <WhatsAppIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <ProductReviews reviews={reviews} rating={product.rating} count={product.reviewCount} />
      </Grid>
    </Grid>
  );
}