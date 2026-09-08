import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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

import { expenseService } from "../../services/expense.service";
import { getErrorMessage } from "../../utils/errors";
import { CURRENCY } from "../../utils/constants";

const CATEGORIES = [
  "rent",
  "salaries",
  "marketing",
  "utilities",
  "logistics",
  "dividend",
  "transportation",
  "transaction costs",
  "other",
];

const STATUS_COLOR = {
  posted: "success",
  pending_approval: "warning",
  rejected: "error",
};

const emptyForm = { category: "", amount: "", description: "" };

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadExpenses() {
    try {
      setLoading(true);
      const payload = await expenseService.list();
      setExpenses(payload?.expenses || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const result = await expenseService.create({
        ...form,
        amount: Number(form.amount) || 0,
      });

      setMessage(
        result?.expense?.status === "posted"
          ? "Expense posted."
          : "Expense submitted for approval."
      );
      setForm(emptyForm);
      loadExpenses();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: "1.7rem", md: "2.1rem" } }}>
          Expenses
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Small expenses post immediately; larger ones require Admin/CEO approval.
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
            Record an expense
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                select
                label="Category"
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Amount (KES)"
                type="number"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <TextField
                label="Description"
                required
                multiline
                minRows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <Button type="submit" variant="contained" disabled={submitting} sx={{ alignSelf: "flex-start" }}>
                {submitting ? "Submitting..." : "Record Expense"}
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
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary">No expenses recorded yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>
                    {CURRENCY.SYMBOL} {Number(expense.amount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={expense.status}
                      color={STATUS_COLOR[expense.status] || "default"}
                    />
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
