import { Stack, Typography } from "@mui/material";
import Card from "../../components/common/Card";

export default function Moderation() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Moderation</Typography>
      <Card><Typography color="text.secondary">Pending moderation items will appear here.</Typography></Card>
    </Stack>
  );
}
