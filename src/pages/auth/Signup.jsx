import { Link, useNavigate } from "react-router-dom";
import { Alert, Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Card from "../../components/common/Card";
import SignupForm from "../../components/forms/SignupForm";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errors";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(values) {
    try {
      setLoading(true);
      setError("");
      await signup(values);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Signup failed."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 520, mx: "auto" }}>
      <Card>
        <Stack spacing={2}>
          <Typography variant="h4">Create account</Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <SignupForm onSubmit={handleSubmit} loading={loading} />
          <Typography color="text.secondary">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}
