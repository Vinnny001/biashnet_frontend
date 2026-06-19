import { Button, Stack } from "@mui/material";
import { useState } from "react";
import Input from "../common/Input";

export default function CheckoutForm({ onSubmit }) {
  const [values, setValues] = useState({ address: "", phone: "", notes: "" });

  function update(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  return (
    <Stack component="form" spacing={1} onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.(values);
    }}>
      <Input label="Delivery address" value={values.address} onChange={update("address")} required />
      <Input label="Phone number" value={values.phone} onChange={update("phone")} required />
      <Input label="Notes" value={values.notes} onChange={update("notes")} multiline minRows={3} />
      <Button type="submit" variant="contained">
        Place order
      </Button>
    </Stack>
  );
}
