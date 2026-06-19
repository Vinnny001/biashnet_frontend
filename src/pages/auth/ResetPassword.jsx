import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import { authService } from "../../services/auth.service";
import { getErrorMessage } from "../../utils/errors";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setError("");
      await authService.resetPassword({ token: params.get("token"), password });
      setMessage("Password updated successfully.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <Box sx={{ maxWidth: 460, mx: "auto" }}>
      <Card>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          <Typography variant="h4">Reset password</Typography>
          {message ? <Alert severity="success">{message}</Alert> : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Input label="New password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <Button type="submit" variant="contained">Update password</Button>
        </Stack>
      </Card>
    </Box>
  );
}
