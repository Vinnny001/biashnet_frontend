import { Box, Skeleton } from "@mui/material";

export default function ProductSkeleton() {
  return (
    <Box
      sx={{
        minWidth: 0,
        overflow: "hidden",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
        }}
      />

      <Box sx={{ p: { xs: 1, sm: 1.25 } }}>
        <Skeleton
          animation="wave"
          width="85%"
          height={18}
        />

        <Skeleton
          animation="wave"
          width="55%"
          height={18}
        />

        <Skeleton
          animation="wave"
          width="45%"
          height={25}
          sx={{ mt: 0.5 }}
        />

        <Skeleton
          animation="wave"
          width="70%"
          height={16}
        />
      </Box>
    </Box>
  );
}