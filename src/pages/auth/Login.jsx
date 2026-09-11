import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import Card from "../../components/common/Card";
import LoginForm from "../../components/forms/LoginForm";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errors";
import { API_BASE_URL, STORAGE_KEYS } from "../../utils/constants";
import { storage } from "../../utils/storage";
import { ROLE_LABELS } from "../../utils/employeeRoles";


import { ROLE_HOME } from "../../utils/roleRoutes";



async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
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

  // Work accounts can hold several roles (e.g. techlead + logistics) —
  // they pick which one to enter before landing on a dashboard.
  const [employeeRoleChoices, setEmployeeRoleChoices] = useState([]);

  /*
   * Sends the user wherever their account type belongs, EXCEPT a work
   * account with more than one role — that stops here to ask which role
   * they want to work as first.
   */
  function finishLogin(session) {
    const nextUser = session?.user;

    if (nextUser?.role === "employee") {
      const roles = Object.entries(nextUser.employeeRoles || {})
        .filter(([, granted]) => granted === true)
        .map(([role]) => role);

      if (roles.length > 1) {
        setEmployeeRoleChoices(roles);
        setStep("employeeRole");
        return;
      }

      if (roles.length === 1) {
        storage.set(STORAGE_KEYS.EMPLOYEE_ROLE, roles[0]);
      }
    }

    navigate(ROLE_HOME[nextUser?.role] || "/", { replace: true });
  }

  function handlePickEmployeeRole(role) {
    storage.set(STORAGE_KEYS.EMPLOYEE_ROLE, role);
    navigate(ROLE_HOME.employee, { replace: true });
  }

  

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
    const result = await postJson("/auth/login/initiate", { email, password, accountType });

    if (result.skipOtp) {
      await completeLogin(result);
      finishLogin(result);
      return;
    }

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
    await completeLogin(session);
    finishLogin(session);
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
          <Typography variant="h4">
            {step === "employeeRole" ? "Choose your role" : "Login"}
          </Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}

          {step === "employeeRole" ? (
            <Stack spacing={2}>
              <Typography color="text.secondary">
                You hold more than one role. Pick the one you want to work as —
                you can switch at any time from your dashboard.
              </Typography>

              {employeeRoleChoices.map((role) => (
                <Button
                  key={role}
                  variant="outlined"
                  size="large"
                  onClick={() => handlePickEmployeeRole(role)}
                  sx={{ justifyContent: "flex-start", fontWeight: 700 }}
                >
                  {ROLE_LABELS[role] || role}
                </Button>
              ))}
            </Stack>
          ) : (
            <>
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
            </>
          )}
        </Stack>
      </Card>
    </Box>
  );
}