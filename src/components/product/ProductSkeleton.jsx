import { Box, Skeleton } from "@mui/material";

export default function ProductSkeleton() {
  return (
    <Box
      sx={{
        minWidth: 0,
        overflow: "hidden",
        borderRadius: { xs: 1.8, sm: 2.5 },
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      {/* Product image */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
        }}
      />

      {/* Product details */}
      <Box sx={{ p: { xs: 0.9, sm: 1.2 } }}>
        {/* Product name */}
        <Skeleton
          animation="wave"
          variant="text"
          width="90%"
          height={18}
        />
        <Skeleton
          animation="wave"
          variant="text"
          width="65%"
          height={18}
        />

        {/* Price */}
        <Skeleton
          animation="wave"
          variant="text"
          width="45%"
          height={25}
          sx={{ mt: 0.2 }}
        />

        {/* Rating / location */}
        <Skeleton
          animation="wave"
          variant="text"
          width="55%"
          height={16}
          sx={{ mt: 0.2 }}
        />

        {/* Cart button */}
        <Skeleton
          animation="wave"
          variant="rounded"
          width="100%"
          height={34}
          sx={{
            mt: 0.6,
            borderRadius: { xs: 1.5, sm: 2 },
          }}
        />
      </Box>
    </Box>
  );
}