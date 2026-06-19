import { Stack, Typography } from "@mui/material";
import Chart from "../../components/admin/Chart";

export default function Analytics() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Seller analytics</Typography>
      <Chart data={[
        { label: "Views", value: 120 },
        { label: "Orders", value: 32 },
        { label: "Chats", value: 18 }
      ]} />
    </Stack>
  );
}
