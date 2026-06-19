import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import { authService } from "../../services/auth.service";
import { getErrorMessage } from "../../utils/errors";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setError("");
      await authService.forgotPassword(email);
      setMessage("Password reset instructions have been sent if the email exists.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <Box sx={{ maxWidth: 460, mx: "auto" }}>
      <Card>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Typography variant="h4">Forgot password</Typography>
          {message ? <Alert severity="success">{message}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Button type="submit" variant="contained">Send reset link</Button>
        </Stack>
      </Card>
    </Box>
  );
}
