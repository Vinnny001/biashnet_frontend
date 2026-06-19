import { Box } from "@mui/material";

export default function ProductImage({ src, alt = "Product image" }) {
  return (
    <Box
      sx={{
        aspectRatio: "4 / 3",
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        overflow: "hidden"
      }}
    >
      {src ? (
        <Box component="img" src={src} alt={alt} sx={{ height: "100%", width: "100%" }} />
      ) : (
        <Box className="image-placeholder" sx={{ height: "100%" }}>
          No image
        </Box>
      )}
    </Box>
  );
}
