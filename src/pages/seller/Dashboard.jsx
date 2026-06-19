import { Stack, Typography } from "@mui/material";
import Chart from "../../components/admin/Chart";
import Stats from "../../components/admin/Stats";

export default function Dashboard() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Seller dashboard</Typography>
      <Stats stats={[
        { label: "Active listings", value: 12 },
        { label: "Orders", value: 8 },
        { label: "Revenue", value: "KES 42K" },
        { label: "Messages", value: 5 }
      ]} />
      <Chart title="Seller activity" data={[
        { label: "Listings", value: 12 },
        { label: "Orders", value: 8 },
        { label: "Messages", value: 5 }
      ]} />
    </Stack>
  );
}
