// src/components/product/ImageUploader.jsx

import { useEffect, useRef } from "react";

import {
  Box,
  Button,
  Card,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const MAX_IMAGES = 8;

export default function ImageUploader({
  value = [],
  onChange,
}) {
  const inputRef = useRef(null);


  /*
  |--------------------------------------------------------------------------
  | Select images
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | We do NOT upload here.
  |
  | We only create local previews.
  |
  */

  function handleSelect(event) {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) return;


    const remaining =
      MAX_IMAGES - value.length;


    const selectedFiles =
      files.slice(0, remaining);


    const newImages = selectedFiles.map(
      (file) => ({
        file,

        preview: URL.createObjectURL(file),

        // Used later to distinguish new images
        uploaded: false,
      })
    );


    onChange([
      ...value,
      ...newImages,
    ]);


    // Allows selecting the same file again
    event.target.value = "";
  }


  /*
  |--------------------------------------------------------------------------
  | Remove image
  |--------------------------------------------------------------------------
  */

  function removeImage(index) {
    const image = value[index];

    /*
    | Free browser memory for local previews.
    */

    if (
      image?.preview &&
      image.preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(image.preview);
    }


    const updated = [...value];

    updated.splice(index, 1);

    onChange(updated);
  }


  /*
  |--------------------------------------------------------------------------
  | Cleanup previews
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      value.forEach((image) => {
        if (
          image?.preview &&
          image.preview.startsWith("blob:")
        ) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, []);


  return (
    <Stack spacing={2}>

      <Typography fontWeight={700}>
        Product Images
      </Typography>


      <input
        ref={inputRef}
        hidden
        multiple
        accept="image/*"
        type="file"
        onChange={handleSelect}
      />


      <Button
        variant="outlined"
        startIcon={
          <AddPhotoAlternateRoundedIcon />
        }
        disabled={
          value.length >= MAX_IMAGES
        }
        onClick={() =>
          inputRef.current?.click()
        }
      >
        Add Images
      </Button>


      <Typography
        variant="caption"
        color="text.secondary"
      >
        {value.length}/{MAX_IMAGES} images selected
      </Typography>


      {value.length > 0 && (
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "repeat(3, 1fr)",
              sm: "repeat(5, 1fr)",
            },

            gap: 2,
          }}
        >

          {value.map((image, index) => (

            <Card
              key={
                image.preview ||
                image.public_id ||
                index
              }
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >

              <CardMedia
                component="img"
                image={
                  image.preview ||
                  image.thumb ||
                  image.full ||
                  image.original
                }
                alt={`Product image ${index + 1}`}
                sx={{
                  aspectRatio: "1",
                  objectFit: "cover",
                }}
              />


              <IconButton
                size="small"
                onClick={() =>
                  removeImage(index)
                }
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  bgcolor: "background.paper",

                  "&:hover": {
                    bgcolor: "background.paper",
                  },
                }}
              >

                <DeleteRoundedIcon
                  fontSize="small"
                  color="error"
                />

              </IconButton>


              {index === 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: "primary.main",
                    color: "white",
                    textAlign: "center",
                    fontSize: 12,
                    py: 0.5,
                    fontWeight: 700,
                  }}
                >
                  COVER
                </Box>
              )}

            </Card>

          ))}

        </Box>
      )}

    </Stack>
  );
}