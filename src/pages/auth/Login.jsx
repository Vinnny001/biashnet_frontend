import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Card from "../../components/common/Card";
import LoginForm from "../../components/forms/LoginForm";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errors";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(values) {
    try {
      setLoading(true);
      setError("");
      await login(values);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Login failed."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 460, mx: "auto" }}>
      <Card>
        <Stack spacing={2}>
          <Typography variant="h4">Login</Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <LoginForm onSubmit={handleSubmit} loading={loading} />
          <Typography color="text.secondary">
            New here? <Link to="/signup">Create an account</Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
