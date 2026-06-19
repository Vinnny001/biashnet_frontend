import { Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import UserTable from "../../components/admin/UserTable";
import Loading from "../../components/common/Loading";
import { useUser } from "../../hooks/useUser";

export default function Users() {
  const { users, loading, fetchUsers } = useUser();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Users</Typography>
      {loading ? <Loading /> : <UserTable users={users} />}
    </Stack>
  );
}
