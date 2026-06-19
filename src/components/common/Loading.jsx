import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loading({ label = "Loading" }) {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        gap: 2,
        justifyContent: "center",
        minHeight: "40vh"
      }}
    >
      <CircularProgress color="primary" size={28} />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  );
}
