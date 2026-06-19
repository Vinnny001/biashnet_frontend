import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

export default function UserTable({ users = [] }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id || user.uid || user._id}>
              <TableCell>{user.name || user.displayName || "User"}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role || "buyer"}</TableCell>
              <TableCell>{user.disabled ? "Disabled" : "Active"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
