import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import ProductCard from "./ProductCard";

export default function NewArrivalsSection({
  products = [],
  title = "New Arrivals",
  subtitle = "Fresh products just added",
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
        flexWrap="wrap"
        rowGap={1}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <NewReleasesRoundedIcon
              color="success"
            />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              {title}
            </Typography>

            <Chip
              label="NEW"
              size="small"
              color="success"
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