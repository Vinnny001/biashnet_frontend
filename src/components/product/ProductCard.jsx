import {
  Card,
  Box,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import { Link } from "react-router-dom";

import ProductImage from "./ProductImage";
import { useCart } from "../../hooks/useCart";
import { formatCurrency } from "../../utils/formatters";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const id = product.id || product._id;

  const image =
    product.image ||
    product.imageUrl ||
    product.images?.[0]?.thumb ||
    product.images?.[0]?.full;

  const name = product.name || product.title || "Product";

  const price = Number(product.price || 0);

  const oldPrice = Number(product.oldPrice || 0);

  const discount =
    oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  return (
    <Card
      component={Link}
      to={`/products/${id}`}
      sx={{
        textDecoration: "none",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 1,
        transition: ".2s",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <ProductImage src={image} alt={name} />

        {discount && (
          <Chip
            label={`-${discount}%`}
            size="small"
            color="error"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              fontWeight: 700,
            }}
          />
        )}

        <IconButton
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            bgcolor: "white",

            "&:hover": {
              bgcolor: "white",
            },
          }}
        >
          <FavoriteBorderOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box p={1.2}>

        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 500,
            lineHeight: 1.3,

            overflow: "hidden",

            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,

            minHeight: 34,
          }}
        >
          {name}
        </Typography>

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 18,
            color: "primary.main",
            mt: .5,
          }}
        >
          {formatCurrency(price)}
        </Typography>

        {oldPrice > price && (
          <Typography
            sx={{
              fontSize: 12,
              textDecoration: "line-through",
              color: "text.secondary",
            }}
          >
            {formatCurrency(oldPrice)}
          </Typography>
        )}

        <Box
          display="flex"
          alignItems="center"
          mt={.5}
        >
          <StarRoundedIcon
            sx={{
              color: "#FDB813",
              fontSize: 16,
            }}
          />

          <Typography
            sx={{
              fontSize: 12,
              ml: .3,
            }}
          >
            {product.rating || "4.8"}
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
              ml: .5,
            }}
          >
            ({product.reviewCount || 12})
          </Typography>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          mt={.5}
        >
          <LocationOnOutlinedIcon
            sx={{
              fontSize: 14,
              color: "text.secondary",
            }}
          />

          <Typography
            sx={{
              fontSize: 11,
              color: "text.secondary",
              ml: .3,
            }}
          >
            {product.location || "Juja"}
          </Typography>
        </Box>

        <IconButton
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          sx={{
            mt: 1,
            width: "100%",
            bgcolor: "primary.main",
            color: "white",
            borderRadius: 2,

            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          <AddShoppingCartRoundedIcon />
        </IconButton>

      </Box>
    </Card>
  );
}