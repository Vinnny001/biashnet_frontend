import { Button, Stack } from "@mui/material";
import { useState } from "react";
import Input from "../common/Input";

export default function LoginForm({ onSubmit, loading = false }) {
  const [values, setValues] = useState({ email: "", password: "" });

  function update(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  return (
    <Stack component="form" spacing={1} onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.(values);
    }}>
      <Input label="Email" type="email" value={values.email} onChange={update("email")} required />
      <Input
        label="Password"
        type="password"
        value={values.password}
        onChange={update("password")}
        required
      />
      <Button disabled={loading} type="submit" variant="contained">
        {loading ? "Logging in..." : "Login"}
      </Button>
    </Stack>
  );
}
