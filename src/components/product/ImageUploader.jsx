import { useRef, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { uploadToCloudinary } from "../../services/cloudinary.service";


const MAX_IMAGES = 8;


export default function ImageUploader({
  value = [],
  onChange,
}) {

  const inputRef = useRef(null);

  const [uploading, setUploading] = useState(false);


  async function handleSelect(event) {

    const files = Array.from(
      event.target.files || []
    );


    if (!files.length) return;


    const remaining =
      MAX_IMAGES - value.length;


    const selectedFiles =
      files.slice(0, remaining);


    setUploading(true);


    try {

      const uploadedImages = [];


      for (const file of selectedFiles) {

        const result =
          await uploadToCloudinary(file);


        if (result) {

          uploadedImages.push(result);

        }

      }


      onChange([
        ...value,
        ...uploadedImages,
      ]);


    } catch(error){

      console.error(
        "Image upload failed",
        error
      );

    }
    finally {

      setUploading(false);

      event.target.value = "";

    }

  }



  function removeImage(index){

    const updated = [...value];

    updated.splice(index,1);

    onChange(updated);

  }



  return (

    <Stack spacing={2}>


      <Typography
        fontWeight={700}
      >
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
          <AddPhotoAlternateRoundedIcon/>
        }
        disabled={
          uploading ||
          value.length >= MAX_IMAGES
        }
        onClick={() =>
          inputRef.current?.click()
        }
      >

        {uploading
          ? "Uploading..."
          : "Add Images"}

      </Button>



      <Typography
        variant="caption"
        color="text.secondary"
      >

        {value.length}/{MAX_IMAGES} images uploaded

      </Typography>



      {
        uploading && (

          <Box
            display="flex"
            justifyContent="center"
          >

            <CircularProgress size={32}/>

          </Box>

        )
      }




      <Box
        sx={{
          display:"grid",

          gridTemplateColumns:{
            xs:"repeat(3,1fr)",
            sm:"repeat(5,1fr)",
          },

          gap:2,
        }}
      >


        {
          value.map((image,index)=>(

            <Card
              key={
                image.public_id || index
              }
              sx={{
                position:"relative",
                borderRadius:2,
                overflow:"hidden",
              }}
            >


              <CardMedia
                component="img"
                image={
                  image.thumb ||
                  image.full ||
                  image.original
                }
                alt="product"
                sx={{
                  aspectRatio:"1",
                  objectFit:"cover",
                }}
              />



              <IconButton
                size="small"
                onClick={()=>
                  removeImage(index)
                }
                sx={{
                  position:"absolute",
                  top:5,
                  right:5,
                  bgcolor:"background.paper",

                  "&:hover":{
                    bgcolor:"background.paper",
                  },
                }}
              >

                <DeleteRoundedIcon
                  fontSize="small"
                  color="error"
                />

              </IconButton>



              {
                index === 0 && (

                  <Box
                    sx={{
                      position:"absolute",
                      bottom:0,
                      left:0,
                      right:0,
                      bgcolor:"primary.main",
                      color:"white",
                      textAlign:"center",
                      fontSize:12,
                      py:.5,
                      fontWeight:700,
                    }}
                  >

                    COVER

                  </Box>

                )
              }


            </Card>

          ))
        }


      </Box>


    </Stack>

  );

}