import { Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h3" color="primary.main">404</Typography>
      <Typography variant="h5">Page not found</Typography>
      <Typography color="text.secondary">The page you requested does not exist.</Typography>
      <Button component={Link} to="/" variant="contained">Go home</Button>
    </Stack>
  );
}
