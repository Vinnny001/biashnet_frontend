import {
  Button,
  MenuItem,
  Stack,
  Divider,
  Typography,
  Box,
} from "@mui/material";

import { useState } from "react";

import Input from "../common/Input";
import ImageUploader from "../product/ImageUploader";


const categories = [
  {
    value: "electronics",
    label: "Electronics",
  },
  {
    value: "phones",
    label: "Phones",
  },
  {
    value: "computers",
    label: "Computers",
  },
  {
    value: "fashion",
    label: "Fashion",
  },
  {
    value: "shoes",
    label: "Shoes",
  },
  {
    value: "home",
    label: "Home & Appliances",
  },
  {
    value: "services",
    label: "Services",
  },
  {
    value: "houses",
    label: "Houses",
  },
  {
    value: "adverts",
    label: "Adverts",
  },
];


const conditions = [
  "New",
  "Used",
  "Refurbished",
];


export default function ProductForm({
  initialValues = {},
  onSubmit,
}) {


  const [images,setImages] = useState(
    initialValues.images || []
  );


  const [values,setValues] = useState({

    name:
      initialValues.name || "",


    category:
      initialValues.category || "electronics",


    subCategory:
      initialValues.subCategory || "",


    price:
      initialValues.price || "",


    oldPrice:
      initialValues.oldPrice || "",


    description:
      initialValues.description || "",


    location:
      initialValues.location || "",


    condition:
      initialValues.condition || "New",


    stock:
      initialValues.stock || 1,

  });



  function update(field){

    return(event)=>{

      setValues(current=>({

        ...current,

        [field]:
        event.target.value,

      }));

    };

  }



  function handleSubmit(event){

    event.preventDefault();


    onSubmit?.({

      ...values,

      images,

      price:Number(values.price),

      oldPrice:
        values.oldPrice
        ?
        Number(values.oldPrice)
        :
        null,


      stock:
        Number(values.stock),

    });

  }



  return (

    <Stack

      component="form"

      spacing={2.5}

      onSubmit={handleSubmit}

    >



      <Typography
        variant="h6"
        fontWeight={700}
      >
        Product Information
      </Typography>



      <Input

        label="Product name"

        value={values.name}

        onChange={update("name")}

        required

      />



      <Input

        select

        label="Category"

        value={values.category}

        onChange={update("category")}

      >

        {
          categories.map(item=>(

            <MenuItem
              key={item.value}
              value={item.value}
            >
              {item.label}
            </MenuItem>

          ))
        }


      </Input>



      <Input

        label="Sub category"

        value={values.subCategory}

        onChange={update("subCategory")}

        placeholder="Example: Samsung phones"

      />



      <Divider/>




      <Typography
        variant="h6"
        fontWeight={700}
      >
        Pricing
      </Typography>




      <Input

        label="Selling price"

        type="number"

        value={values.price}

        onChange={update("price")}

        required

      />



      <Input

        label="Previous price (optional)"

        type="number"

        value={values.oldPrice}

        onChange={update("oldPrice")}

      />




      <Divider/>




      <Typography
        variant="h6"
        fontWeight={700}
      >
        Product Details
      </Typography>




      <Input

        select

        label="Condition"

        value={values.condition}

        onChange={update("condition")}

      >

        {
          conditions.map(condition=>(

            <MenuItem
              key={condition}
              value={condition}
            >
              {condition}
            </MenuItem>

          ))
        }


      </Input>




      <Input

        label="Stock quantity"

        type="number"

        value={values.stock}

        onChange={update("stock")}

      />




      <Input

        label="Location"

        value={values.location}

        onChange={update("location")}

        placeholder="Example: Juja, Nairobi"

      />




      <Input

        label="Description"

        value={values.description}

        onChange={update("description")}

        multiline

        minRows={5}

      />




      <Divider/>




      <Typography
        variant="h6"
        fontWeight={700}
      >
        Product Images
      </Typography>




      <ImageUploader

        value={images}

        onChange={setImages}

      />




      <Box>

        <Button

          type="submit"

          variant="contained"

          size="large"

          fullWidth

          disabled={!images.length}

        >

          Publish Product

        </Button>


      </Box>


    </Stack>

  );

}