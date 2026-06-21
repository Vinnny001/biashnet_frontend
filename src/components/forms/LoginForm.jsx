import { Box, Button, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Input from "../common/Input";

const ACCOUNT_TYPE_LABELS = { buyer: "Buyer", seller: "Seller", investor: "Investor", admin: "Admin" };

export default function LoginForm({ step, accountTypes = [], onCheckEmail, onLogin, onVerifyOtp, onBack, loading = false }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("");
  const [code, setCode] = useState("");

  if (step === "email") {
    return (
      <Stack component="form" spacing={1} onSubmit={(e) => { e.preventDefault(); onCheckEmail?.(email); }}>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button disabled={loading} type="submit" variant="contained">
          {loading ? "Checking..." : "Continue"}
        </Button>
      </Stack>
    );
  }

  if (step === "credentials") {
    return (
      <Stack component="form" spacing={1} onSubmit={(e) => { e.preventDefault(); onLogin?.({ password, accountType }); }}>
        <Typography color="text.secondary" variant="body2">
          Signing in as <strong>{email}</strong>
        </Typography>
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Sign in as</Typography>
          <RadioGroup value={accountType} onChange={(e) => setAccountType(e.target.value)}>
            {accountTypes.map((type) => (
              <FormControlLabel key={type} value={type} control={<Radio />} label={ACCOUNT_TYPE_LABELS[type] || type} />
            ))}
          </RadioGroup>
        </Box>
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button disabled={loading || !accountType} type="submit" variant="contained">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        <Button color="inherit" onClick={onBack} disabled={loading}>Back</Button>
      </Stack>
    );
  }

  return (
    <Stack component="form" spacing={1} onSubmit={(e) => { e.preventDefault(); onVerifyOtp?.(code); }}>
      <Typography color="text.secondary" variant="body2">
        Enter the 6-digit code we sent to <strong>{email}</strong>
      </Typography>
      <Input
        label="Verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        inputProps={{ maxLength: 6, inputMode: "numeric" }}
        required
      />
      <Button disabled={loading || code.length !== 6} type="submit" variant="contained">
        {loading ? "Verifying..." : "Verify"}
      </Button>
      <Button color="inherit" onClick={onBack} disabled={loading}>Back</Button>
    </Stack>
  );
}