import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  AccountBalanceWalletRounded,
  AccessTimeRounded,
  CheckCircleRounded,
  ErrorOutlineRounded,
  HourglassBottomRounded,
  PaymentsRounded,
  RefreshRounded,
  SavingsRounded,
  SendRounded,
} from "@mui/icons-material";

import Loading from "../../components/common/Loading";

import { sellerService } from "../../services/seller.service";
import {
  cancelWithdrawal,
  createWithdrawal,
  getMyWithdrawals,
} from "../../services/withdrawalService";

import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errors";
import { formatDate } from "../../utils/formatters";

/*
 * Mirrors MIN_WITHDRAWAL_AMOUNT in the payment service
 * (config/paymentConstants.js). The server is still the authority — this
 * only saves the seller a round-trip.
 */
const MIN_WITHDRAWAL = 10;

const STATUS_CONFIG = {
  PENDING: {
    color: "warning",
    label: "Pending",
    icon: <AccessTimeRounded sx={{ fontSize: 15 }} />,
  },
  PROCESSING: {
    color: "info",
    label: "Processing",
    icon: <HourglassBottomRounded sx={{ fontSize: 15 }} />,
  },
  COMPLETED: {
    color: "success",
    label: "Paid out",
    icon: <CheckCircleRounded sx={{ fontSize: 15 }} />,
  },
  FAILED: {
    color: "error",
    label: "Failed",
    icon: <ErrorOutlineRounded sx={{ fontSize: 15 }} />,
  },
  CANCELLED: {
    color: "default",
    label: "Cancelled",
    icon: <ErrorOutlineRounded sx={{ fontSize: 15 }} />,
  },
};

function formatCurrency(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

function BalanceCard({ label, value, caption, icon: Icon, highlight }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: highlight ? "primary.main" : "divider",
        boxShadow: "none",
        bgcolor: highlight ? "primary.main" : "background.paper",
        color: highlight ? "primary.contrastText" : "text.primary",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: highlight
                  ? "rgba(255,255,255,0.85)"
                  : "text.secondary",
              }}
            >
              {label}
            </Typography>

            <Typography
              variant="h5"
              fontWeight={800}
              sx={{ wordBreak: "break-word" }}
            >
              {value}
            </Typography>

            {caption && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.75,
                  color: highlight
                    ? "rgba(255,255,255,0.85)"
                    : "text.secondary",
                }}
              >
                {caption}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              bgcolor: highlight ? "rgba(255,255,255,0.18)" : "primary.main",
              color: highlight ? "inherit" : "primary.contrastText",
            }}
          >
            <Icon />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function StatusChip({ status }) {
  const config =
    STATUS_CONFIG[String(status || "").toUpperCase()] ||
    STATUS_CONFIG.PENDING;

  return (
    <Chip
      size="small"
      variant="outlined"
      color={config.color}
      icon={config.icon}
      label={config.label}
    />
  );
}

export default function Wallet() {
  const { user } = useAuth();

  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [walletResult, withdrawalResult] = await Promise.allSettled([
        sellerService.wallet(),
        getMyWithdrawals(),
      ]);

      if (walletResult.status === "rejected") {
        throw walletResult.reason;
      }

      setWallet(walletResult.value?.wallet || null);

      setWithdrawals(
        withdrawalResult.status === "fulfilled" &&
          Array.isArray(withdrawalResult.value?.withdrawals)
          ? withdrawalResult.value.withdrawals
          : []
      );
    } catch (err) {
      console.error("Failed to load seller wallet:", err);
      setError(getErrorMessage(err, "Could not load your wallet."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /*
   * Prefill with whatever number the account already has so the common
   * case is one tap. The seller can still type a different M-Pesa line.
   */
  useEffect(() => {
    if (phoneNumber) return;

    const existing = user?.phone || user?.phoneNumber || "";
    if (existing) setPhoneNumber(String(existing));
  }, [user, phoneNumber]);

  const available = Number(wallet?.availableBalance || 0);

  const pendingWithdrawals = useMemo(
    () =>
      withdrawals.filter((item) =>
        ["PENDING", "PROCESSING"].includes(
          String(item.status || "").toUpperCase()
        )
      ),
    [withdrawals]
  );

  async function handleWithdraw(event) {
    event.preventDefault();

    setError("");
    setNotice("");

    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter the amount you want to withdraw.");
      return;
    }

    if (value < MIN_WITHDRAWAL) {
      setError(`The minimum withdrawal is ${formatCurrency(MIN_WITHDRAWAL)}.`);
      return;
    }

    if (value > available) {
      setError(
        `You can withdraw up to ${formatCurrency(
          available
        )} right now. Funds still held in escrow are released once the buyer confirms delivery.`
      );
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Enter the M-Pesa number to send the money to.");
      return;
    }

    try {
      setSubmitting(true);

      await createWithdrawal({
        amount: value,
        phoneNumber: phoneNumber.trim(),
      });

      setAmount("");

      setNotice(
        `${formatCurrency(
          value
        )} is on its way to ${phoneNumber.trim()}. M-Pesa usually delivers within a few minutes.`
      );

      await load();
    } catch (err) {
      console.error("Withdrawal failed:", err);
      setError(getErrorMessage(err, "Could not start your withdrawal."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCancel(withdrawalId) {
    setError("");
    setNotice("");

    try {
      setCancellingId(withdrawalId);

      await cancelWithdrawal(withdrawalId);

      setNotice("Withdrawal cancelled. The money is back in your wallet.");

      await load();
    } catch (err) {
      console.error("Failed to cancel withdrawal:", err);
      setError(getErrorMessage(err, "Could not cancel that withdrawal."));
    } finally {
      setCancellingId("");
    }
  }

  if (loading) {
    return <Loading label="Loading your wallet" />;
  }

  return (
    <Stack spacing={3}>
      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {notice && (
        <Alert severity="success" onClose={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={900}>
            Seller Wallet
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Your sales earnings, and withdrawals straight to M-Pesa.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshRounded />}
          onClick={load}
          sx={{ fontWeight: 700 }}
        >
          Refresh
        </Button>
      </Stack>

      {!wallet && (
        <Alert severity="info">
          You do not have a seller wallet yet. One is created automatically
          the first time a buyer pays for one of your products.
        </Alert>
      )}

      {/* Balances */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <BalanceCard
            highlight
            label="Available to withdraw"
            value={formatCurrency(wallet?.availableBalance)}
            caption="Released to you — withdraw any time"
            icon={AccountBalanceWalletRounded}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <BalanceCard
            label="Held in escrow"
            value={formatCurrency(wallet?.pendingBalance)}
            caption="Released once the buyer confirms delivery"
            icon={HourglassBottomRounded}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <BalanceCard
            label="Total earned"
            value={formatCurrency(wallet?.totalEarned)}
            caption="All sales, after commission"
            icon={SavingsRounded}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <BalanceCard
            label="Total withdrawn"
            value={formatCurrency(wallet?.totalWithdrawn)}
            caption={
              Number(wallet?.withdrawalBalance || 0) > 0
                ? `${formatCurrency(
                    wallet.withdrawalBalance
                  )} locked in a withdrawal in progress`
                : "Paid out to M-Pesa"
            }
            icon={PaymentsRounded}
          />
        </Grid>
      </Grid>

      {/* Withdraw */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
            Withdraw to M-Pesa
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Minimum {formatCurrency(MIN_WITHDRAWAL)}. The money leaves your
            wallet immediately and arrives on M-Pesa within a few minutes.
          </Typography>

          <Box component="form" onSubmit={handleWithdraw}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Amount"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  type="number"
                  inputProps={{
                    min: MIN_WITHDRAWAL,
                    max: available,
                    step: "1",
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">KES</InputAdornment>
                    ),
                  }}
                  disabled={submitting || available <= 0}
                />
              </Grid>

              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="M-Pesa number"
                  placeholder="0712345678"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  disabled={submitting || available <= 0}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  startIcon={
                    submitting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <SendRounded />
                    )
                  }
                  disabled={submitting || available <= 0}
                  sx={{
                    py: 1.75,
                    fontWeight: 800,
                    borderRadius: 2,
                  }}
                >
                  {submitting ? "Sending" : "Withdraw"}
                </Button>
              </Grid>
            </Grid>
          </Box>

          {available <= 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              You have nothing available to withdraw yet.
              {Number(wallet?.pendingBalance || 0) > 0
                ? ` ${formatCurrency(
                    wallet.pendingBalance
                  )} is still held in escrow until your buyers confirm delivery.`
                : ""}
            </Alert>
          )}

          {available > 0 && (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              sx={{ mt: 2 }}
            >
              <Button
                size="small"
                onClick={() => setAmount(String(Math.floor(available)))}
                sx={{ fontWeight: 700 }}
              >
                Withdraw everything
              </Button>

              {pendingWithdrawals.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {pendingWithdrawals.length} withdrawal
                  {pendingWithdrawals.length === 1 ? "" : "s"} still in
                  progress
                </Typography>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            Withdrawal History
          </Typography>

          {withdrawals.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 2 }}>
              You have not made any withdrawals yet.
            </Typography>
          ) : (
            <Stack divider={<Divider />} spacing={0}>
              {withdrawals.map((item) => {
                const status = String(item.status || "").toUpperCase();

                return (
                  <Stack
                    key={item.id}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    sx={{ py: 2 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography fontWeight={800}>
                        {formatCurrency(item.amount)}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {item.phoneNumber || "M-Pesa"} ·{" "}
                        {formatDate(item.createdAt)}
                      </Typography>

                      {item.mpesaReceiptNumber && (
                        <Typography variant="caption" color="text.secondary">
                          Receipt {item.mpesaReceiptNumber}
                        </Typography>
                      )}

                      {status === "FAILED" && item.failureReason && (
                        <Typography variant="caption" color="error.main">
                          {item.failureReason}
                        </Typography>
                      )}
                    </Box>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      flexWrap="wrap"
                    >
                      <StatusChip status={item.status} />

                      {status === "PENDING" && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleCancel(item.id)}
                          disabled={cancellingId === item.id}
                          sx={{ fontWeight: 700 }}
                        >
                          {cancellingId === item.id
                            ? "Cancelling"
                            : "Cancel"}
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
