import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  CheckCircleRounded,
  ImageRounded,
  Inventory2Rounded,
  LocationOnRounded,
  PaymentsRounded,
  PublishRounded,
  StorefrontRounded,
} from "@mui/icons-material";

import { useState } from "react";

import Input from "../common/Input";
import ImageUploader from "../product/ImageUploader";

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

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <Stack spacing={2.5}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon />
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={900}>
            {title}
          </Typography>

          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.25 }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Stack>

      {children}
    </Stack>
  );
}

export default function ProductForm({
  initialValues = {},
  onSubmit,
}) {
  const [images, setImages] = useState(
    initialValues.images || []
  );

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

    const name = values.name.trim();
    const price = Number(values.price);
    const stock = Number(values.stock);

    if (!name) {
      setError("Please enter the product name.");
      return;
    }

    if (!values.category) {
      setError("Please select a category.");
      return;
    }

    if (!values.price || Number.isNaN(price) || price <= 0) {
      setError("Please enter a valid selling price.");
      return;
    }

    if (!stock || Number.isNaN(stock) || stock < 1) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    if (!values.location.trim()) {
      setError("Please enter your selling location.");
      return;
    }

    if (!values.description.trim()) {
      setError("Please add a short product description.");
      return;
    }

    if (!images.length) {
      setError("Please add at least one product image.");
      return;
    }

    if (images.length > 8) {
      setError("You can upload a maximum of 8 images.");
      return;
    }

    setPublishing(true);

    try {
      const newFiles = images
        .filter((image) => image?.file)
        .map((image) => image.file);

      const existingImages = images.filter(
        (image) => !image?.file
      );

      const formData = new FormData();

      formData.append("name", name);
      formData.append("category", values.category);
      formData.append(
        "subCategory",
        values.subCategory.trim()
      );
      formData.append("price", price);

      formData.append(
        "oldPrice",
        values.oldPrice !== "" &&
          values.oldPrice !== null
          ? Number(values.oldPrice)
          : ""
      );

      formData.append(
        "description",
        values.description.trim()
      );

      formData.append(
        "location",
        values.location.trim()
      );

      formData.append("condition", values.condition);
      formData.append("stock", stock);

      formData.append(
        "existingImages",
        JSON.stringify(existingImages)
      );

      newFiles.forEach((file) => {
        formData.append("images", file);
      });

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
    <Stack
      component="form"
      spacing={{ xs: 3, md: 4 }}
      onSubmit={handleSubmit}
    >
      {/* Error */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      {/* Images first */}
      <FormSection
        icon={ImageRounded}
        title="Product Photos"
        description="Good photos help buyers trust your listing."
      >
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 1.5, md: 2 },
            borderRadius: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Add up to 8 clear photos. Use a main photo that
            clearly shows the product.
          </Typography>

          <ImageUploader
            value={images}
            onChange={setImages}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1.5 }}
          >
            {images.length}/8 images selected
          </Typography>
        </Paper>
      </FormSection>

      <Divider />

      {/* Basic information */}
      <FormSection
        icon={StorefrontRounded}
        title="Basic Information"
        description="Tell buyers what you are selling."
      >
        <Input
          label="Product name"
          value={values.name}
          onChange={update("name")}
          placeholder="Example: Samsung Galaxy A15"
          required
          fullWidth
        />

        <Input
          select
          label="Category"
          value={values.category}
          onChange={update("category")}
          fullWidth
        >
          {categories.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Input>

        <Input
          label="Subcategory"
          value={values.subCategory}
          onChange={update("subCategory")}
          placeholder="Example: Samsung phones"
          fullWidth
        />

        <Input
          label="Description"
          value={values.description}
          onChange={update("description")}
          placeholder="Describe the product, features, condition and anything buyers should know."
          multiline
          minRows={5}
          fullWidth
        />
      </FormSection>

      <Divider />

      {/* Pricing */}
      <FormSection
        icon={PaymentsRounded}
        title="Price"
        description="Set your selling price and optional previous price."
      >
        <Input
          label="Selling price"
          type="number"
          value={values.price}
          onChange={update("price")}
          placeholder="Example: 18000"
          required
          fullWidth
          inputProps={{ min: 0 }}
        />

        <Input
          label="Previous price"
          type="number"
          value={values.oldPrice}
          onChange={update("oldPrice")}
          placeholder="Optional"
          fullWidth
          inputProps={{ min: 0 }}
        />
      </FormSection>

      <Divider />

      {/* Inventory */}
      <FormSection
        icon={Inventory2Rounded}
        title="Inventory"
        description="Tell us how many items are available."
      >
        <Input
          select
          label="Condition"
          value={values.condition}
          onChange={update("condition")}
          fullWidth
        >
          {conditions.map((condition) => (
            <MenuItem
              key={condition}
              value={condition}
            >
              {condition}
            </MenuItem>
          ))}
        </Input>

        <Input
          label="Stock quantity"
          type="number"
          value={values.stock}
          onChange={update("stock")}
          required
          fullWidth
          inputProps={{ min: 1 }}
        />
      </FormSection>

      <Divider />

      {/* Location */}
      <FormSection
        icon={LocationOnRounded}
        title="Location"
        description="Help buyers know where you are located."
      >
        <Input
          label="Selling location"
          value={values.location}
          onChange={update("location")}
          placeholder="Example: Juja, Nairobi"
          required
          fullWidth
        />
      </FormSection>

      {/* Publish */}
      <Box
        sx={{
          position: { xs: "sticky", md: "static" },
          bottom: { xs: 76, md: "auto" },
          zIndex: 5,
          bgcolor: "background.paper",
          pt: 1,
        }}
      >
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={!images.length || publishing}
          startIcon={
            publishing ? null : <PublishRounded />
          }
          sx={{
            minHeight: 54,
            borderRadius: 2.5,
            fontWeight: 900,
            fontSize: "1rem",
          }}
        >
          {publishing
            ? "Publishing Product..."
            : "Publish Product"}
        </Button>

        {!publishing && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0.75}
            sx={{ mt: 1 }}
          >
            <CheckCircleRounded
              sx={{ fontSize: 16 }}
              color="success"
            />

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Your listing will be reviewed according to
              BIASHNET marketplace rules.
            </Typography>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}