import { Button, MenuItem, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import Input from "../common/Input";

export default function SignupForm({ onSubmit, loading = false }) {
  const [accountType, setAccountType] = useState("individual");
  const [values, setValues] = useState({
    firstName: "",
    surname: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer"
  });
  const [passwordError, setPasswordError] = useState("");

  function update(field) {
    return (event) => setValues((current) => ({ ...current, [field]: event.target.value }));
  }

  function handleAccountTypeChange(event, nextType) {
    // ToggleButtonGroup fires with null if you click the already-selected button;
    // ignore that so the toggle can't be deselected entirely
    if (nextType !== null) {
      setAccountType(nextType);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (values.password !== values.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");

    const payload = {
      accountType,
      email: values.email,
      password: values.password,
      role: values.role,
      ...(accountType === "individual"
        ? { firstName: values.firstName, surname: values.surname }
        : { businessName: values.businessName })
    };

    onSubmit?.(payload);
  }

  return (
    <Stack component="form" spacing={1} onSubmit={handleSubmit}>
      <ToggleButtonGroup
        color="primary"
        exclusive
        fullWidth
        value={accountType}
        onChange={handleAccountTypeChange}
        sx={{ mb: 1 }}
      >
        <ToggleButton value="individual">Individual</ToggleButton>
        <ToggleButton value="business">Business</ToggleButton>
      </ToggleButtonGroup>

      {accountType === "individual" ? (
        <>
          <Input label="First Name" value={values.firstName} onChange={update("firstName")} required />
          <Input label="Surname" value={values.surname} onChange={update("surname")} required />
        </>
      ) : (
        <Input
          label="Business Name"
          value={values.businessName}
          onChange={update("businessName")}
          required
        />
      )}

      <Input label="Email" type="email" value={values.email} onChange={update("email")} required />
      <Input
        label="Password"
        type="password"
        value={values.password}
        onChange={update("password")}
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        value={values.confirmPassword}
        onChange={update("confirmPassword")}
        error={Boolean(passwordError)}
        helperText={passwordError}
        required
      />
      <Input select label="Role" value={values.role} onChange={update("role")}>
        <MenuItem value="buyer">Buyer</MenuItem>
        <MenuItem value="seller">Seller</MenuItem>
        <MenuItem value="investor">Investor</MenuItem>
      </Input>
      <Button disabled={loading} type="submit" variant="contained">
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </Stack>
  );
}