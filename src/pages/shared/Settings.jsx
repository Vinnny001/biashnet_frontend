import { Stack, Switch, Typography } from "@mui/material";
import Card from "../../components/common/Card";

export default function Settings() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Settings</Typography>
      <Card>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography>Email notifications</Typography>
          <Switch defaultChecked color="primary" />
        </Stack>
      </Card>
    </Stack>
  );
}
