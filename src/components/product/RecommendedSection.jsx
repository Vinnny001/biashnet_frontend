import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import ProductCard from "./ProductCard";

export default function RecommendedSection({
  products = [],
  title = "Recommended For You",
  subtitle = "Products we think you'll love",
  onSeeAll,
}) {
  if (!products.length) return null;

  return (
    <Box
      sx={{
        mb: 4,
        p: 2,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Header */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        rowGap={1}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <AutoAwesomeRoundedIcon
              color="primary"
            />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              {title}
            </Typography>

            <Chip
              label="For You"
              size="small"
              color="primary"
            />
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

      {/* Products */}

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