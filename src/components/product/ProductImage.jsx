import { Box } from "@mui/material";
import ImageIcon from "@mui/icons-material/ImageNotSupported";

export default function ProductImage({
  src,
  alt = "Product image",
}) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        bgcolor: "action.hover",
        overflow: "hidden",
      }}
    >
      {src ? (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            color: "text.secondary",
          }}
        >
          <ImageIcon fontSize="small" />
          <Box component="span" sx={{ fontSize: 11 }}>
            No image
          </Box>
        </Box>
      )}
    </Box>
  );
}