// src/components/product/ProductForm.jsx

import {
  Button,
  MenuItem,
  Stack,
  Divider,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

import { useState } from "react";

import Input from "../common/Input";
import ImageUploader from "../product/ImageUploader";

// uploadService no longer needed here — upload server handles everything now

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "phones", label: "Phones" },
  { value: "computers", label: "Computers" },
  { value: "fashion", label: "Fashion" },
  { value: "shoes", label: "Shoes" },
  { value: "home", label: "Home & Appliances" },
  { value: "services", label: "Services" },
  { value: "houses", label: "Houses" },
  { value: "adverts", label: "Adverts" },
];

const conditions = ["New", "Used", "Refurbished"];

export default function ProductForm({ initialValues = {}, onSubmit }) {
  const [images, setImages] = useState(initialValues.images || []);

  const [values, setValues] = useState({
    name: initialValues.name || "",
    category: initialValues.category || "electronics",
    subCategory: initialValues.subCategory || "",
    price: initialValues.price || "",
    oldPrice: initialValues.oldPrice || "",
    description: initialValues.description || "",
    location: initialValues.location || "",
    condition: initialValues.condition || "New",
    stock: initialValues.stock ?? 1,
  });

  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  function update(field) {
    return (event) => {
      setValues((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (publishing) {
      return;
    }

    setError("");

    /*
    |--------------------------------------------------------------------------
    | Validate product
    |--------------------------------------------------------------------------
    */

    if (!values.name.trim()) {
      setError("Please enter the product name.");
      return;
    }

    if (!values.price) {
      setError("Please enter the selling price.");
      return;
    }

    if (!images.length) {
      setError("Please add at least one product image.");
      return;
    }

    setPublishing(true);

    try {
      /*
      |--------------------------------------------------------------------------
      | Split new files (need upload) vs existing images (already have URLs)
      |--------------------------------------------------------------------------
      */

      const newFiles = images
        .filter((image) => image?.file)
        .map((image) => image.file);

      const existingImages = images.filter((image) => !image?.file);

      /*
      |--------------------------------------------------------------------------
      | Build ONE multipart request — product fields + image files together
      |--------------------------------------------------------------------------
      |
      | POST http://localhost:5050/upload/product
      |
      | verifySeller -> Multer -> Cloudinary -> Firestore, all server-side.
      |
      */

      const formData = new FormData();

      formData.append("name", values.name.trim());
      formData.append("category", values.category);
      formData.append("subCategory", values.subCategory);
      formData.append("price", Number(values.price));

      formData.append(
        "oldPrice",
        values.oldPrice !== "" && values.oldPrice !== null
          ? Number(values.oldPrice)
          : ""
      );

      formData.append("description", values.description);
      formData.append("location", values.location);
      formData.append("condition", values.condition);
      formData.append("stock", Number(values.stock));

      // Existing image objects (relevant when editing), server can merge these
      formData.append("existingImages", JSON.stringify(existingImages));

      // New files — Multer picks these up as an array under "images"
      newFiles.forEach((file) => {
        formData.append("images", file);
      });

      /*
      |--------------------------------------------------------------------------
      | Send to parent — parent calls productService.create(formData)
      |--------------------------------------------------------------------------
      */

      await onSubmit?.(formData);
    } catch (err) {
      console.error("Product publishing failed:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to publish product. Please try again.";

      setError(message);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
      {error && (
        <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: "error.light", color: "error.contrastText" }}>
          <Typography variant="body2" fontWeight={600}>
            {error}
          </Typography>
        </Box>
      )}

      <Typography variant="h6" fontWeight={700}>Product Information</Typography>
      <Input label="Product name" value={values.name} onChange={update("name")} required />
      <Input select label="Category" value={values.category} onChange={update("category")}>
        {categories.map((item) => (
          <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
        ))}
      </Input>
      <Input label="Sub category" value={values.subCategory} onChange={update("subCategory")} placeholder="Example: Samsung phones" />

      <Divider />

      <Typography variant="h6" fontWeight={700}>Pricing</Typography>
      <Input label="Selling price" type="number" value={values.price} onChange={update("price")} required inputProps={{ min: 0 }} />
      <Input label="Previous price (optional)" type="number" value={values.oldPrice} onChange={update("oldPrice")} inputProps={{ min: 0 }} />

      <Divider />

      <Typography variant="h6" fontWeight={700}>Product Details</Typography>
      <Input select label="Condition" value={values.condition} onChange={update("condition")}>
        {conditions.map((condition) => (
          <MenuItem key={condition} value={condition}>{condition}</MenuItem>
        ))}
      </Input>
      <Input label="Stock quantity" type="number" value={values.stock} onChange={update("stock")} inputProps={{ min: 1 }} />
      <Input label="Location" value={values.location} onChange={update("location")} placeholder="Example: Juja, Nairobi" />
      <Input label="Description" value={values.description} onChange={update("description")} multiline minRows={5} />

      <Divider />

      <Typography variant="h6" fontWeight={700}>Product Images</Typography>
      <Typography variant="body2" color="text.secondary">
        Select up to 8 images. Images will be uploaded when you publish.
      </Typography>
      <ImageUploader value={images} onChange={setImages} />

      <Box>
        <Button type="submit" variant="contained" size="large" fullWidth disabled={!images.length || publishing}>
          {publishing ? (
            <>
              <CircularProgress size={22} color="inherit" sx={{ mr: 1 }} />
              Publishing...
            </>
          ) : (
            "Publish Product"
          )}
        </Button>
      </Box>
    </Stack>
  );
}