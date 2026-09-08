import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { employeeService } from "../../services/employee.service";
import { positionService } from "../../services/position.service";
import { getErrorMessage } from "../../utils/errors";

const ROLE_KEYS = ["ceo", "hr", "accountant", "techlead", "marketing", "admin"];

const EMPLOYMENT_STATUSES = ["active", "suspended", "terminated"];

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ userId: "", positionId: "", roles: {} });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      const [employeePayload, positionPayload] = await Promise.all([
        employeeService.list(),
        positionService.list(),
      ]);
      setEmployees(employeePayload?.employees || []);
      setPositions(positionPayload?.positions || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function toggleRole(role) {
    setForm((prev) => ({
      ...prev,
      roles: { ...prev.roles, [role]: !prev.roles[role] },
    }));
  }

  async function handleCreate(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await employeeService.create(form);

      setMessage("Employee linked successfully.");
      setForm({ userId: "", positionId: "", roles: {} });
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(employeeId, employmentStatus) {
    try {
      setError("");
      await employeeService.updateStatus(employeeId, employmentStatus);
      setMessage(`Status updated to ${employmentStatus}.`);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function positionName(positionId) {
    return positions.find((p) => p.id === positionId)?.name || positionId || "—";
  }

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: "1.7rem", md: "2.1rem" } }}>
          Employees
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Link users as employees and manage their status. Role grants go through CEO approval.
        </Typography>
      </Box>

      {message && (
        <Alert severity="success" onClose={() => setMessage("")}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <CardContent>
          <Typography fontWeight={800} sx={{ mb: 2 }}>
            Link a new employee
          </Typography>
          <Box component="form" onSubmit={handleCreate}>
            <Stack spacing={2}>
              <TextField
                label="User ID (Firebase UID)"
                required
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                helperText="The user must already have a Biashnet account."
              />
              <TextField
                select
                label="Position"
                required
                value={form.positionId}
                onChange={(e) => setForm({ ...form, positionId: e.target.value })}
              >
                {positions.map((position) => (
                  <MenuItem key={position.id} value={position.id}>
                    {position.name}
                  </MenuItem>
                ))}
              </TextField>

              <Box>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
                  Initial roles
                </Typography>
                <FormGroup row>
                  {ROLE_KEYS.map((role) => (
                    <FormControlLabel
                      key={role}
                      control={
                        <Checkbox checked={Boolean(form.roles[role])} onChange={() => toggleRole(role)} />
                      }
                      label={role}
                    />
                  ))}
                </FormGroup>
              </Box>

              <Button type="submit" variant="contained" disabled={submitting} sx={{ alignSelf: "flex-start" }}>
                {submitting ? "Linking..." : "Link Employee"}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary">No employees yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {employees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>{emp.id}</TableCell>
                  <TableCell>{positionName(emp.positionId)}</TableCell>
                  <TableCell>
                    {Object.entries(emp.roles || {})
                      .filter(([, active]) => active)
                      .map(([role]) => role)
                      .join(", ") || "—"}
                  </TableCell>
                  <TableCell>{emp.employmentStatus}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value=""
                      displayEmpty
                      onChange={(e) => e.target.value && handleStatusChange(emp.id, e.target.value)}
                      sx={{ minWidth: 140 }}
                    >
                      <MenuItem value="" disabled>
                        Change status
                      </MenuItem>
                      {EMPLOYMENT_STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Stack>
  );
}
