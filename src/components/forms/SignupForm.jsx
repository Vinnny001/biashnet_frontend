import { Button, MenuItem, Stack } from "@mui/material";
import { useState } from "react";
import Input from "../common/Input";

export default function SignupForm({ onSubmit, loading = false }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer"
  });

  function update(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  return (
    <Stack component="form" spacing={1} onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.(values);
    }}>
      <Input label="Name" value={values.name} onChange={update("name")} required />
      <Input label="Email" type="email" value={values.email} onChange={update("email")} required />
      <Input
        label="Password"
        type="password"
        value={values.password}
        onChange={update("password")}
        required
      />
      <Input select label="Account type" value={values.role} onChange={update("role")}>
        <MenuItem value="buyer">Buyer</MenuItem>
        <MenuItem value="seller">Seller</MenuItem>
      </Input>
      <Button disabled={loading} type="submit" variant="contained">
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </Stack>
  );
}
