import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function ServerError() {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h3" color="primary.main">500</Typography>
      <Typography variant="h5">Server error</Typography>
      <Typography color="text.secondary">The backend could not complete the request.</Typography>
      <Button component={Link} to="/" variant="contained">Go home</Button>
    </Stack>
  );
}
