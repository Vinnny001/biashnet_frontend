import { Stack, Typography } from "@mui/material";
import Card from "../../components/common/Card";

export default function Reports() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Reports</Typography>
      <Card><Typography color="text.secondary">Reported listings and users will appear here.</Typography></Card>
    </Stack>
  );
}
