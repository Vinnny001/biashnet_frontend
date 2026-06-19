import { Stack, Typography } from "@mui/material";
import Card from "../../components/common/Card";

export default function Notifications() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Notifications</Typography>
      <Card>
        <Typography color="text.secondary">Your notifications will appear here.</Typography>
      </Card>
    </Stack>
  );
}
