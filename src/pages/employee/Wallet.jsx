import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
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

import { financeWithdrawalService } from "../../services/financeWithdrawal.service";
import { useEmployee } from "../../hooks/useEmployee";
import { getErrorMessage } from "../../utils/errors";
import { CURRENCY } from "../../utils/constants";

const STATUS_COLOR = {
  COMPLETED: "success",
  PROCESSING: "info",
  PENDING: "warning",
  FAILED: "error",
};

export default function Wallet() {
  const { wallet, refreshEmployee } = useEmployee();

  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadWithdrawals() {
    try {
      const payload = await financeWithdrawalService.list();
      setWithdrawals(payload?.withdrawals || []);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  useEffect(() => {
    loadWithdrawals();
  }, []);

  async function handleWithdraw(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await financeWithdrawalService.create({ amount: Number(amount), phoneNumber });

      setMessage("Withdrawal request submitted.");
      setAmount("");
      setPhoneNumber("");
      loadWithdrawals();
      refreshEmployee();
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
          Wallet
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Your balance and M-Pesa withdrawals.
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

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Available Balance
              </Typography>
              <Typography variant="h5" fontWeight={900}>
                {CURRENCY.SYMBOL} {Number(wallet?.availableBalance || 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total Withdrawn
              </Typography>
              <Typography variant="h5" fontWeight={900}>
                {CURRENCY.SYMBOL} {Number(wallet?.totalWithdrawn || 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <CardContent>
          <Typography fontWeight={800} sx={{ mb: 2 }}>
            Withdraw to M-Pesa
          </Typography>
          <Box component="form" onSubmit={handleWithdraw}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-end" }}>
              <TextField
                label="Amount (KES)"
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <TextField
                label="M-Pesa Phone Number"
                required
                placeholder="0712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Submitting..." : "Withdraw"}
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
                <TableCell>Amount</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {withdrawals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography color="text.secondary">No withdrawals yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {withdrawals.map((w) => (
                <TableRow key={w.id}>
                  <TableCell>
                    {CURRENCY.SYMBOL} {Number(w.amount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{w.phone}</TableCell>
                  <TableCell>
                    <Chip size="small" label={w.status} color={STATUS_COLOR[w.status] || "default"} />
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
