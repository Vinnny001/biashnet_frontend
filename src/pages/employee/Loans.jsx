import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
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

import { loanService } from "../../services/loan.service";
import { getErrorMessage } from "../../utils/errors";
import { CURRENCY } from "../../utils/constants";

const emptyLenderForm = { name: "", phone: "", email: "" };
const emptyLoanForm = { lenderId: "", principal: "", interestRate: "", termMonths: "" };

export default function Loans() {
  const [lenders, setLenders] = useState([]);
  const [loans, setLoans] = useState([]);
  const [lenderForm, setLenderForm] = useState(emptyLenderForm);
  const [loanForm, setLoanForm] = useState(emptyLoanForm);
  const [repayAmounts, setRepayAmounts] = useState({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [lenderPayload, loanPayload] = await Promise.all([
        loanService.listLenders(),
        loanService.listLoans(),
      ]);
      setLenders(lenderPayload?.lenders || []);
      setLoans(loanPayload?.loans || []);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateLender(event) {
    event.preventDefault();
    try {
      setBusy(true);
      setError("");
      setMessage("");
      await loanService.createLender(lenderForm);
      setMessage("Lender created.");
      setLenderForm(emptyLenderForm);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleCreateLoan(event) {
    event.preventDefault();
    try {
      setBusy(true);
      setError("");
      setMessage("");
      await loanService.createLoan({
        ...loanForm,
        principal: Number(loanForm.principal) || 0,
        interestRate: Number(loanForm.interestRate) || 0,
        termMonths: loanForm.termMonths ? Number(loanForm.termMonths) : null,
      });
      setMessage("Loan disbursement submitted for CEO approval.");
      setLoanForm(emptyLoanForm);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleRepay(loanId) {
    const amount = Number(repayAmounts[loanId]);
    if (!amount) return;
    try {
      setBusy(true);
      setError("");
      await loanService.repayLoan(loanId, amount);
      setMessage("Repayment submitted for CEO approval.");
      setRepayAmounts((prev) => ({ ...prev, [loanId]: "" }));
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function lenderName(lenderId) {
    return lenders.find((l) => l.id === lenderId)?.name || lenderId;
  }

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: "1.7rem", md: "2.1rem" } }}>
          Loans
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Lenders and loan disbursement/repayment. All entries require CEO approval.
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
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", height: "100%" }}>
            <CardContent>
              <Typography fontWeight={800} sx={{ mb: 2 }}>
                New lender
              </Typography>
              <Box component="form" onSubmit={handleCreateLender}>
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    required
                    value={lenderForm.name}
                    onChange={(e) => setLenderForm({ ...lenderForm, name: e.target.value })}
                  />
                  <TextField
                    label="Phone"
                    value={lenderForm.phone}
                    onChange={(e) => setLenderForm({ ...lenderForm, phone: e.target.value })}
                  />
                  <TextField
                    label="Email"
                    value={lenderForm.email}
                    onChange={(e) => setLenderForm({ ...lenderForm, email: e.target.value })}
                  />
                  <Button type="submit" variant="outlined" disabled={busy} sx={{ alignSelf: "flex-start" }}>
                    Add Lender
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none", height: "100%" }}>
            <CardContent>
              <Typography fontWeight={800} sx={{ mb: 2 }}>
                New loan disbursement
              </Typography>
              <Box component="form" onSubmit={handleCreateLoan}>
                <Stack spacing={2}>
                  <TextField
                    select
                    label="Lender"
                    required
                    value={loanForm.lenderId}
                    onChange={(e) => setLoanForm({ ...loanForm, lenderId: e.target.value })}
                  >
                    {lenders.map((lender) => (
                      <MenuItem key={lender.id} value={lender.id}>
                        {lender.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Principal (KES)"
                    type="number"
                    required
                    value={loanForm.principal}
                    onChange={(e) => setLoanForm({ ...loanForm, principal: e.target.value })}
                  />
                  <TextField
                    label="Interest Rate (%)"
                    type="number"
                    value={loanForm.interestRate}
                    onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })}
                  />
                  <TextField
                    label="Term (months)"
                    type="number"
                    value={loanForm.termMonths}
                    onChange={(e) => setLoanForm({ ...loanForm, termMonths: e.target.value })}
                  />
                  <Button type="submit" variant="contained" disabled={busy} sx={{ alignSelf: "flex-start" }}>
                    Submit Loan
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lender</TableCell>
                <TableCell>Principal</TableCell>
                <TableCell>Repaid</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Repay</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary">No loans yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{lenderName(loan.lenderId)}</TableCell>
                  <TableCell>
                    {CURRENCY.SYMBOL} {Number(loan.principal || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {CURRENCY.SYMBOL} {Number(loan.repaidAmount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={loan.status} />
                  </TableCell>
                  <TableCell>
                    {loan.status === "active" && (
                      <Stack direction="row" spacing={1}>
                        <TextField
                          size="small"
                          type="number"
                          placeholder="Amount"
                          value={repayAmounts[loan.id] || ""}
                          onChange={(e) =>
                            setRepayAmounts((prev) => ({ ...prev, [loan.id]: e.target.value }))
                          }
                          sx={{ width: 110 }}
                        />
                        <Button size="small" variant="outlined" onClick={() => handleRepay(loan.id)}>
                          Repay
                        </Button>
                      </Stack>
                    )}
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
