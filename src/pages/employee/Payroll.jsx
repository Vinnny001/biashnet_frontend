import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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
import { payrollService } from "../../services/payroll.service";
import { getErrorMessage } from "../../utils/errors";
import { CURRENCY } from "../../utils/constants";

export default function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [history, setHistory] = useState([]);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    employeeService
      .list()
      .then((payload) => setEmployees(payload?.employees || []))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  async function loadHistory(employeeId) {
    if (!employeeId) {
      setHistory([]);
      return;
    }
    try {
      const payload = await payrollService.history(employeeId);
      setHistory(payload?.history || []);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function handleSelect(employeeId) {
    setSelectedEmployeeId(employeeId);
    loadHistory(employeeId);
  }

  async function handleRun() {
    if (!selectedEmployeeId) return;
    try {
      setRunning(true);
      setError("");
      setMessage("");

      const result = await payrollService.run(selectedEmployeeId);

      setMessage(
        result?.queuedForApproval
          ? "Payroll run submitted for CEO approval."
          : "Stipend paid successfully."
      );
      loadHistory(selectedEmployeeId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setRunning(false);
    }
  }

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: "1.7rem", md: "2.1rem" } }}>
          Payroll
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Run a stipend payout for an employee based on their position.
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
          <Stack spacing={2} direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "flex-end" }}>
            <TextField
              select
              label="Employee"
              value={selectedEmployeeId}
              onChange={(e) => handleSelect(e.target.value)}
              sx={{ minWidth: 260 }}
            >
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.id}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              disabled={!selectedEmployeeId || running}
              onClick={handleRun}
            >
              {running ? "Running..." : "Run Stipend Payout"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Period</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography color="text.secondary">
                      {selectedEmployeeId ? "No payouts yet." : "Select an employee to view history."}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {history.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.metadata?.period || "—"}</TableCell>
                  <TableCell>
                    {CURRENCY.SYMBOL} {Number(row.amount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Stack>
  );
}
