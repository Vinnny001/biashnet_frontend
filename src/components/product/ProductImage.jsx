import { Box } from "@mui/material";
import ImageIcon from "@mui/icons-material/ImageNotSupported";

/*
 * With no `size`, the image fills whatever box it is given — that is how
 * the product cards use it, each inside its own fixed-ratio frame.
 *
 * A `size` gives a fixed square instead, for the places that show a
 * thumbnail in a row of text: the cart and the seller's product list.
 * Without it those rows have nothing to constrain the image and it grows
 * to the full width of the page.
 */
export default function ProductImage({
  src,
  alt = "Product image",
  size,
}) {
  const box = size
    ? { width: size, height: size, flexShrink: 0, borderRadius: 8 }
    : { width: "100%", height: "100%", minWidth: 0, minHeight: 0 };

  return (
    <Box
      sx={{
        ...box,
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