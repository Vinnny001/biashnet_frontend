import { Stack, Typography } from "@mui/material";
import Card from "../../components/common/Card";

export default function Promotions() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Promotions</Typography>
      <Card><Typography color="text.secondary">Promotion tools will appear here.</Typography></Card>
    </Stack>
  );
}
