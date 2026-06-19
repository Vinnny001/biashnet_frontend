import { Stack, Typography } from "@mui/material";
import Card from "../../components/common/Card";

export default function Terms() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Terms</Typography>
      <Card>
        <Typography color="text.secondary">
          Use Biashnet responsibly, keep listing information accurate, and follow marketplace policies.
        </Typography>
      </Card>
    </Stack>
  );
}
