import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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

import { investorLedgerService } from "../../services/investorLedger.service";
import { useAuth } from "../../hooks/useAuth";
import { useEmployee } from "../../hooks/useEmployee";
import { getErrorMessage } from "../../utils/errors";
import { CURRENCY } from "../../utils/constants";

export default function InvestorLedger() {
  const { user } = useAuth();
  const { hasRole } = useEmployee();

  const canLookupOthers = hasRole("accountant", "admin", "ceo");

  const [investorId, setInvestorId] = useState(user?.uid || user?.id || "");
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadLedger(id) {
    if (!id) return;
    try {
      setLoading(true);
      setError("");
      const payload = await investorLedgerService.ledger(id);
      setWallet(payload?.wallet || null);
      setTransactions(payload?.transactions || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (investorId) loadLedger(investorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePayout(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const result = await investorLedgerService.payout(investorId, Number(payoutAmount));

      setMessage(
        result?.queuedForApproval ? "Payout submitted for CEO approval." : "Payout recorded."
      );
      setPayoutAmount("");
      loadLedger(investorId);
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
          Investor Ledger
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {canLookupOthers
            ? "View any investor's contributions and payouts, or record a new payout."
            : "Your own investor contributions and payouts."}
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

      {canLookupOthers && (
        <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <CardContent>
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "flex-end" }}>
              <TextField
                label="Investor ID"
                value={investorId}
                onChange={(e) => setInvestorId(e.target.value)}
                sx={{ minWidth: 260 }}
              />
              <Button variant="outlined" onClick={() => loadLedger(investorId)} disabled={loading}>
                {loading ? "Loading..." : "Load Ledger"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <CardContent>
          <Typography variant="caption" color="text.secondary">
            Contribution Balance
          </Typography>
          <Typography variant="h5" fontWeight={900}>
            {CURRENCY.SYMBOL} {Number(wallet?.contributionBalance || 0).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      {canLookupOthers && (
        <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <CardContent>
            <Typography fontWeight={800} sx={{ mb: 2 }}>
              Record a payout
            </Typography>
            <Box component="form" onSubmit={handlePayout}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-end" }}>
                <TextField
                  label="Amount (KES)"
                  type="number"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                />
                <Button type="submit" variant="contained" disabled={submitting}>
                  {submitting ? "Submitting..." : "Record Payout"}
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Direction</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary">No transactions yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {transactions.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.transactionType}</TableCell>
                  <TableCell>
                    {CURRENCY.SYMBOL} {Number(row.amount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{row.direction}</TableCell>
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
