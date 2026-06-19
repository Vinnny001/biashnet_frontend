import { Alert, Stack, Typography } from "@mui/material";
import { useState } from "react";
import Card from "../../components/common/Card";
import ProfileForm from "../../components/forms/ProfileForm";
import { useAuth } from "../../hooks/useAuth";
import { userService } from "../../services/user.service";
import { getErrorMessage } from "../../utils/errors";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(values) {
    try {
      setError("");
      const payload = await userService.updateProfile(values);
      const nextUser = payload?.data || payload;
      setUser(nextUser);
      setMessage("Profile updated.");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Profile</Typography>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Card>
        <ProfileForm user={user} onSubmit={handleSubmit} />
      </Card>
    </Stack>
  );
}
