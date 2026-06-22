import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, Box, Stack, Typography } from "@mui/material";
import Card from "../../components/common/Card";
import LoginForm from "../../components/forms/LoginForm";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errors";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const ROLE_HOME = {
  admin: "/admin/dashboard",
  seller: "/seller/dashboard",
  investor: "/",
  buyer: "/"
};

async function postJson(path, body) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok || data.success === false) {
    const error = new Error(data.message || "Request failed.");
    error.response = { data };
    throw error;
  }
  return data;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeLogin } = useAuth(); // see note below
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [accountTypes, setAccountTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  

  async function handleCheckEmail(value) {
    try {
      setLoading(true);
      setError("");
      const result = await postJson("/auth/login/check-email", { email: value });
      if (!result.exists || result.accountTypes.length === 0) {
        setError("No account found for that email.");
        return;
      }
      setEmail(value);
      setAccountTypes(result.accountTypes);
      setStep("credentials");
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't check that email."));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin({ password, accountType }) {
    try {
      setLoading(true);
      setError("");
      await postJson("/auth/login/initiate", { email, password, accountType });
      setStep("otp");
    } catch (err) {
      setError(getErrorMessage(err, "Login failed."));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(code) {
  try {
    setLoading(true);
    setError("");
    const session = await postJson("/auth/login/verify-otp", { email, code });
    await completeLogin(session); // or completeLogin — see point 2 below
    const destination = location.state?.from?.pathname || ROLE_HOME[session.user?.role] || "/";
    navigate(destination, { replace: true });
  } catch (err) {
    setError(getErrorMessage(err, "Verification failed."));
  } finally {
    setLoading(false);
  }
}

  function handleBack() {
    setError("");
    setStep((current) => (current === "otp" ? "credentials" : "email"));
  }

  return (
    <Box sx={{ maxWidth: 460, mx: "auto" }}>
      <Card>
        <Stack spacing={2}>
          <Typography variant="h4">Login</Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <LoginForm
            step={step}
            accountTypes={accountTypes}
            loading={loading}
            onCheckEmail={handleCheckEmail}
            onLogin={handleLogin}
            onVerifyOtp={handleVerifyOtp}
            onBack={handleBack}
          />
          <Typography color="text.secondary">
            New here? <Link to="/signup">Create an account</Link>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}