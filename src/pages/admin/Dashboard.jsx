import { Stack, Typography } from "@mui/material";
import Chart from "../../components/admin/Chart";
import Stats from "../../components/admin/Stats";

export default function Dashboard() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Admin dashboard</Typography>
      <Stats stats={[
        { label: "Users", value: 0 },
        { label: "Products", value: 0 },
        { label: "Orders", value: 0 },
        { label: "Sellers", value: 0 }
      ]} />
      <Chart title="Platform overview" data={[
        { label: "Users", value: 10 },
        { label: "Products", value: 18 },
        { label: "Orders", value: 7 }
      ]} />
    </Stack>
  );
}
