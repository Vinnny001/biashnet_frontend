import { Stack, Typography } from "@mui/material";
import UserTable from "../../components/admin/UserTable";

export default function Sellers() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Sellers</Typography>
      <UserTable users={[]} />
    </Stack>
  );
}
