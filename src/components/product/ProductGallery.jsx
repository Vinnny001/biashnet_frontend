// components/product/ProductGallery.jsx
import { Box, Stack } from "@mui/material";
import { useState } from "react";
import ImageIcon from "@mui/icons-material/ImageNotSupported";

const DEFAULT_MAX_WIDTH = 380; // <-- tune this to taste

export default function ProductGallery({
  images = [],
  alt = "Product image",
  maxWidth = DEFAULT_MAX_WIDTH,
}) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth,
          mx: "auto",
          aspectRatio: "1 / 1",
          borderRadius: 3,
          bgcolor: "grey.100",
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          color: "text.secondary",
        }}
      >
        <ImageIcon />
        <Box component="span" sx={{ fontSize: 14 }}>
          No image
        </Box>
      </Box>
    );
  }

  const current = images[active];

  return (
    <Stack spacing={1.5} sx={{ maxWidth, mx: "auto" }}>
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          component="img"
          src={current.full || current.original}
          alt={alt}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      {images.length > 1 && (
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {images.map((img, i) => (
            <Box
              key={img.public_id || i}
              component="img"
              src={img.thumb || img.small}
              alt={`${alt} thumbnail ${i + 1}`}
              onClick={() => setActive(i)}
              sx={{
                width: 56,
                height: 56,
                objectFit: "cover",
                borderRadius: 2,
                cursor: "pointer",
                border: (theme) =>
                  `2px solid ${
                    i === active ? theme.palette.primary.main : "transparent"
                  }`,
                opacity: i === active ? 1 : 0.7,
                transition: "all 0.15s ease",
                "&:hover": { opacity: 1 },
              }}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}