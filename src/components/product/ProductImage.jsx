import { Box } from "@mui/material";
import ImageIcon from "@mui/icons-material/ImageNotSupported";

const IMAGE_SIZE = 180; // adjust to taste — same value used for width & height

export default function ProductImage({
  src,
  alt = "Product image",
  size = IMAGE_SIZE,
}) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
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
            bgcolor: "grey.100",
          }}
        >
          <ImageIcon fontSize="small" />
          <Box component="span" sx={{ fontSize: 12 }}>
            No image
          </Box>
        </Box>
      )}
    </Box>
  );
}