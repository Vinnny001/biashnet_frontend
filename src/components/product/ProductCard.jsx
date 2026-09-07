import {
  Card,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Stack,
} from "@mui/material";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatters";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const id = product.id || product._id;
  const name = product.name || product.title || "Product";

  const image =
    product.images?.[0]?.thumb ||
    product.images?.[0]?.full ||
    product.image ||
    product.imageUrl;

  const price = Number(
    product.price ??
    product.currentPrice ??
    product.sellingPrice ??
    0
  );

  const markedPrice = Number(
    product.markedPrice ??
    product.originalPrice ??
    product.oldPrice ??
    0
  );

  const hasDiscount =
    markedPrice > price && price > 0;

  const saving = hasDiscount
    ? markedPrice - price
    : 0;

  const discount = hasDiscount
    ? Math.round((saving / markedPrice) * 100)
    : 0;

  const rating = Number(product.rating || 0);
  const reviews = Number(product.reviewCount || 0);

  const flashSale =
    product.flashSale === true;

  const promoted =
    product.promoted === true;

  const verified =
    product.verifiedSeller === true ||
    product.sellerVerified === true;

  const inStock =
    product.stock === undefined ||
    Number(product.stock) > 0;

  return (
    <Card
      sx={{
        position: "relative",
        borderRadius: 2.5,
        overflow: "hidden",
        height: "100%",
        bgcolor: "#000000",
        boxShadow: "0 2px 10px rgba(0,0,0,.08)",
      }}
    >
      {/* IMAGE */}
      <Box
        component={Link}
        to={`/products/${id}`}
        sx={{
          position: "relative",
          display: "block",
          textDecoration: "none",
        }}
      >
        <ProductImage
          src={image}
          alt={name}
        />

        {/* OFFER BADGES */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            position: "absolute",
            top: 7,
            left: 7,
          }}
        >
          {flashSale && (
            <Chip
              icon={<FlashOnRoundedIcon />}
              label="SALE"
              size="small"
              color="error"
              sx={{
                height: 24,
                fontWeight: 800,
                "& .MuiChip-icon": {
                  fontSize: 15,
                },
              }}
            />
          )}

          {hasDiscount && !flashSale && (
            <Chip
              label={`-${discount}%`}
              size="small"
              color="error"
              sx={{
                height: 24,
                fontWeight: 800,
              }}
            />
          )}
        </Stack>

        {/* FAVORITE */}
        <IconButton
          onClick={(e) => e.preventDefault()}
          size="small"
          sx={{
            position: "absolute",
            top: 7,
            right: 7,
            bgcolor: "rgba(3, 8, 1, 0.95)",
            "&:hover": {
              bgcolor: "#dd0b0b",
            },
          }}
        >
          <FavoriteBorderRoundedIcon
            fontSize="small"
          />
        </IconButton>

        {!inStock && (
          <Chip
            label="OUT OF STOCK"
            size="small"
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              bgcolor: "#111",
              color: "#fff",
              fontWeight: 700,
            }}
          />
        )}
      </Box>

      {/* DETAILS */}
      <Box p={1.2}>

        <Typography
          component={Link}
          to={`/products/${id}`}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textDecoration: "none",
            color: "text.primary",
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.3,
            minHeight: 34,
          }}
        >
          {name}
        </Typography>

        {/* PRICE */}
        <Box mt={0.6}>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 900,
              color: "#F4B400",
            }}
          >
            {formatCurrency(price)}
          </Typography>

          {hasDiscount && (
            <Stack
              direction="row"
              spacing={0.7}
              alignItems="center"
            >
              <Typography
                sx={{
                  fontSize: 11,
                  color: "text.secondary",
                  textDecoration:
                    "line-through",
                }}
              >
                {formatCurrency(markedPrice)}
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#e53935",
                  fontWeight: 800,
                }}
              >
                Save {formatCurrency(saving)}
              </Typography>
            </Stack>
          )}
        </Box>

        {/* TRUST + RATING */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          mt={0.6}
        >
          <StarRoundedIcon
            sx={{
              fontSize: 15,
              color: "#F4B400",
            }}
          />

          <Typography fontSize={11}>
            {rating > 0
              ? rating.toFixed(1)
              : "New"}
          </Typography>

          {reviews > 0 && (
            <Typography
              fontSize={11}
              color="text.secondary"
            >
              ({reviews})
            </Typography>
          )}

          {verified && (
            <VerifiedRoundedIcon
              sx={{
                fontSize: 15,
                color: "#1976d2",
                ml: 0.3,
              }}
            />
          )}
        </Stack>

        {/* LOCATION */}
        <Stack
          direction="row"
          alignItems="center"
          mt={0.5}
        >
          <LocationOnRoundedIcon
            sx={{
              fontSize: 14,
              color: "text.secondary",
            }}
          />

          <Typography
            fontSize={11}
            color="text.secondary"
            noWrap
          >
            {product.location || "Kenya"}
          </Typography>
        </Stack>

        {/* BUY BUTTON */}
        <Button
          fullWidth
          variant="contained"
          disabled={!inStock}
          startIcon={
            <ShoppingCartRoundedIcon />
          }
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          sx={{
            mt: 1,
            minHeight: 38,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 800,
            fontSize: 13,
          }}
        >
          {inStock
            ? "Add to Cart"
            : "Out of Stock"}
        </Button>

        {/* SMALL SALES MESSAGE */}
        {hasDiscount && (
          <Typography
            sx={{
              mt: 0.6,
              textAlign: "center",
              fontSize: 10,
              color: "#e53935",
              fontWeight: 700,
            }}
          >
            🔥 Limited-time saving
          </Typography>
        )}

      </Box>
    </Card>
  );
}