import { Stack, Typography } from "@mui/material";
import Chart from "../../components/admin/Chart";

export default function Analytics() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Analytics</Typography>
      <Chart data={[
        { label: "Traffic", value: 85 },
        { label: "Orders", value: 42 },
        { label: "Revenue", value: 63 }
      ]} />
    </Stack>
  );
}
