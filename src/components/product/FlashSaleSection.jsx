import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ProductCard from "./ProductCard";

export default function FlashSaleSection({
  products = [],
  countdown = "02:14:56",
  title = "Flash Sale",
  onSeeAll,
}) {
  if (!products.length) return null;

  return (
    <Box
      sx={{
        mb: 4,
        p: 2,
        borderRadius: 3,
        bgcolor: "error.main",
        color: "white",
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
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <LocalFireDepartmentRoundedIcon />

          <Typography
            variant="h6"
            fontWeight={700}
          >
            {title}
          </Typography>

          <Chip
            label={`Ends in ${countdown}`}
            size="small"
            sx={{
              bgcolor: "white",
              color: "error.main",
              fontWeight: 700,
            }}
          />
        </Stack>

        <Button
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={onSeeAll}
          sx={{
            color: "white",
            borderColor: "white",

            "&:hover": {
              borderColor: "white",
            },
          }}
          variant="outlined"
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