import { Stack, Typography } from "@mui/material";
import Card from "../../components/common/Card";

export default function Privacy() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Privacy</Typography>
      <Card>
        <Typography color="text.secondary">
          Biashnet keeps frontend secrets out of the browser. Authentication tokens are sent only to the backend API over HTTPS in production.
        </Typography>
      </Card>
    </Stack>
  );
}
