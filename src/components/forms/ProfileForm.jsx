import { Button, Stack } from "@mui/material";
import { useState } from "react";
import Input from "../common/Input";

export default function ProfileForm({ user, onSubmit }) {
  const [values, setValues] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || ""
  });

  function update(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  return (
    <Stack component="form" spacing={1} onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.(values);
    }}>
      <Input label="Name" value={values.name} onChange={update("name")} />
      <Input label="Phone" value={values.phone} onChange={update("phone")} />
      <Input label="Location" value={values.location} onChange={update("location")} />
      <Button type="submit" variant="contained">
        Save profile
      </Button>
    </Stack>
  );
}
