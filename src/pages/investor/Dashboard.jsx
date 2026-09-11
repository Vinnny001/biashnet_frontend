import { useEffect, useState } from "react";
import {
  Alert,
  Box,
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
  Typography
} from "@mui/material";
import {
  AccountBalanceWalletRounded,
  PieChartRounded,
  SavingsRounded
} from "@mui/icons-material";

import Loading from "../../components/common/Loading";
import { investorLedgerService } from "../../services/investorLedger.service";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getErrorMessage } from "../../utils/errors";

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon color="primary" />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h6" fontWeight={800}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function InvestorDashboard() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    investorLedgerService
      .ledger(user.uid)
      .then((payload) => {
        setWallet(payload?.wallet || null);
        setTransactions(payload?.transactions || []);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [user?.uid]);

  if (loading) return <Loading label="Loading your investment..." />;

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: "1.7rem", md: "2.1rem" } }}>
          Investor Dashboard
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Your contributions, shares, and payout history.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={SavingsRounded}
            label="Total contributed"
            value={formatCurrency(wallet?.totalContributions || 0)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={AccountBalanceWalletRounded}
            label="Available balance"
            value={formatCurrency(wallet?.availableBalance || 0)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={PieChartRounded}
            label="Shares"
            value={Number(wallet?.shares || 0).toLocaleString()}
          />
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <CardContent>
          <Typography fontWeight={800} sx={{ mb: 1 }}>
            Ledger
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Direction</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography color="text.secondary">
                        No investment activity recorded yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {transactions.map((tx) => (
                  <TableRow key={tx.id || tx.transactionId}>
                    <TableCell>{formatDate(tx.createdAt)}</TableCell>
                    <TableCell>{tx.transactionType || "—"}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={tx.direction || "—"}
                        color={tx.direction === "received" ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell align="right">{formatCurrency(tx.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Stack>
  );
}
