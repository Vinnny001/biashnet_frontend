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
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

import { Link, useNavigate } from "react-router-dom";
import ProductImage from "./ProductImage";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useWishlist } from "../../hooks/useWishlist";
import { formatCurrency } from "../../utils/formatters";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { canLike, isLiked, toggle, likeCountOf } = useWishlist();

  const id = product.id || product._id;
  const name = product.name || product.title || "Product";

  const liked = isLiked(id);
  const likes = likeCountOf(product);

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

  const oldPrice = Number(
    product.markedPrice ??
      product.originalPrice ??
      product.oldPrice ??
      0
  );

  const discounted = oldPrice > price && price > 0;
  const discount = discounted
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const rating = Number(product.rating || 0);
  const reviews = Number(product.reviewCount || 0);

  const flashSale = product.flashSale === true;

  const verified =
    product.verifiedSeller === true ||
    product.sellerVerified === true;

  const inStock =
    product.stock === undefined ||
    Number(product.stock) > 0;

  return (
    <Card
      sx={{
        width: "100%",
        minWidth: 0,
        height: "100%",
        overflow: "hidden",
        borderRadius: { xs: 1.8, sm: 2.5 },
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        boxShadow: {
          xs: "0 1px 6px rgba(0,0,0,.08)",
          md: "0 2px 10px rgba(0,0,0,.08)",
        },
      }}
    >
      {/* IMAGE */}
      <Box
        component={Link}
        to={`/products/${id}`}
        sx={{
          position: "relative",
          display: "block",
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          bgcolor: "action.hover",
          textDecoration: "none",
        }}
      >
        <ProductImage src={image} alt={name} />

        {/* SALE */}
        {(flashSale || discounted) && (
          <Chip
            icon={
              flashSale ? (
                <FlashOnRoundedIcon />
              ) : undefined
            }
            label={flashSale ? "SALE" : `-${discount}%`}
            size="small"
            color="error"
            sx={{
              position: "absolute",
              top: 6,
              left: 6,
              height: 22,
              fontSize: 10,
              fontWeight: 900,
              "& .MuiChip-icon": {
                fontSize: 13,
              },
            }}
          />
        )}

        {/* WISHLIST */}
        {(canLike || !isAuthenticated) && (
          <Box
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              display: "flex",
              alignItems: "center",
              borderRadius: 5,
              bgcolor: "rgba(0,0,0,.65)",
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!canLike) {
                  navigate("/login");
                  return;
                }

                toggle(id);
              }}
              sx={{
                p: 0.7,
                color: liked ? "#ff3b30" : "#fff",
              }}
            >
              {liked ? (
                <FavoriteRoundedIcon sx={{ fontSize: 17 }} />
              ) : (
                <FavoriteBorderRoundedIcon sx={{ fontSize: 17 }} />
              )}
            </IconButton>

            {likes > 0 && (
              <Typography
                sx={{
                  pr: 0.7,
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 800,
                }}
              >
                {likes}
              </Typography>
            )}
          </Box>
        )}

        {!inStock && (
          <Box
            sx={{
              position: "absolute",
              bottom: 6,
              left: 6,
              px: 0.7,
              py: 0.3,
              borderRadius: 1,
              bgcolor: "rgba(0,0,0,.75)",
              color: "#fff",
              fontSize: 9,
              fontWeight: 800,
            }}
          >
            OUT OF STOCK
          </Box>
        )}
      </Box>

      {/* DETAILS */}
      <Box
        sx={{
          p: { xs: 0.9, sm: 1.2 },
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* NAME */}
        <Typography
          component={Link}
          to={`/products/${id}`}
          sx={{
            color: "text.primary",
            textDecoration: "none",
            fontSize: { xs: 12, sm: 13 },
            lineHeight: 1.3,
            fontWeight: 600,

            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",

            minHeight: { xs: 31, sm: 34 },
          }}
        >
          {name}
        </Typography>

        {/* PRICE */}
        <Typography
          sx={{
            mt: 0.5,
            fontSize: { xs: 16, sm: 18 },
            lineHeight: 1.15,
            fontWeight: 900,
            color: "primary.main",
          }}
        >
          {formatCurrency(price)}
        </Typography>

        {/* OLD PRICE */}
        {discounted && (
          <Typography
            sx={{
              mt: 0.25,
              fontSize: { xs: 10, sm: 11 },
              color: "text.secondary",
              textDecoration: "line-through",
            }}
          >
            {formatCurrency(oldPrice)}
          </Typography>
        )}

        {/* RATING */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.3}
          sx={{
            mt: 0.45,
            minWidth: 0,
          }}
        >
          <StarRoundedIcon
            sx={{
              fontSize: 14,
              color: "primary.main",
            }}
          />

          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            {rating > 0 ? rating.toFixed(1) : "New"}
          </Typography>

          {reviews > 0 && (
            <Typography
              sx={{
                fontSize: 9,
                color: "text.secondary",
              }}
            >
              ({reviews})
            </Typography>
          )}

          {verified && (
            <VerifiedRoundedIcon
              sx={{
                ml: 0.2,
                fontSize: 14,
                color: "#1976d2",
              }}
            />
          )}
        </Stack>

        {/* LOCATION */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.2}
          sx={{
            mt: 0.35,
            minWidth: 0,
          }}
        >
          <LocationOnRoundedIcon
            sx={{
              fontSize: 13,
              color: "text.secondary",
              flexShrink: 0,
            }}
          />

          <Typography
            sx={{
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontSize: 9.5,
              color: "text.secondary",
            }}
          >
            {product.location || "Kenya"}
          </Typography>
        </Stack>

        {/* CART */}
        <Button
          fullWidth
          variant="contained"
          disabled={!inStock}
          startIcon={
            <ShoppingCartRoundedIcon
              sx={{ fontSize: "16px !important" }}
            />
          }
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          sx={{
            mt: 0.8,
            minHeight: { xs: 34, sm: 38 },
            px: 0.5,
            borderRadius: { xs: 1.5, sm: 2 },
            fontSize: { xs: 11, sm: 13 },
            fontWeight: 800,

            "& .MuiButton-startIcon": {
              mr: { xs: 0.3, sm: 0.7 },
            },
          }}
        >
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </Box>
    </Card>
  );
}