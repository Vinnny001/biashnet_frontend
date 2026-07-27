import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import ProductCard from "./ProductCard";

export default function FeaturedSection({
  products = [],
  title = "Featured Products",
  subtitle = "Promoted products from verified sellers",
  onSeeAll,
}) {
  if (!products.length) return null;

  return (
    <Box
      sx={{
        mb: 4,
      }}
    >
      {/* Header */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <StarRoundedIcon color="warning" />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              {title}
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {subtitle}
          </Typography>
        </Box>

        <Button
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={onSeeAll}
        >
          See All
        </Button>
      </Stack>

      {/* Horizontal Products */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 1,

          scrollBehavior: "smooth",

          "&::-webkit-scrollbar": {
            display: "none",
          },

          scrollbarWidth: "none",
        }}
      >
        {products.map((product) => (
          <Box
            key={product.id || product._id}
            sx={{
              minWidth: {
                xs: 180,
                sm: 220,
              },
              maxWidth: {
                xs: 180,
                sm: 220,
              },
              flexShrink: 0,
            }}
          >
            <ProductCard product={product} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}