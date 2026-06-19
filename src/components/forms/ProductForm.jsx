import { Button, MenuItem, Stack } from "@mui/material";
import { useState } from "react";
import Input from "../common/Input";

export default function ProductForm({ initialValues = {}, onSubmit }) {
  const [values, setValues] = useState({
    name: initialValues.name || "",
    category: initialValues.category || "products",
    price: initialValues.price || "",
    description: initialValues.description || ""
  });

  function update(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  return (
    <Stack component="form" spacing={1} onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.(values);
    }}>
      <Input label="Product name" value={values.name} onChange={update("name")} required />
      <Input select label="Category" value={values.category} onChange={update("category")}>
        <MenuItem value="products">Products</MenuItem>
        <MenuItem value="services">Services</MenuItem>
        <MenuItem value="houses">Houses</MenuItem>
        <MenuItem value="adverts">Adverts</MenuItem>
      </Input>
      <Input label="Price" type="number" value={values.price} onChange={update("price")} required />
      <Input
        label="Description"
        value={values.description}
        onChange={update("description")}
        multiline
        minRows={4}
      />
      <Button type="submit" variant="contained">
        Save product
      </Button>
    </Stack>
  );
}
