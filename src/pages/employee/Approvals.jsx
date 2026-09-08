import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { CheckRounded, CloseRounded } from "@mui/icons-material";

import { approvalService } from "../../services/approval.service";
import { getErrorMessage } from "../../utils/errors";

export default function Approvals() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadApprovals() {
    try {
      setLoading(true);
      const payload = await approvalService.list();
      setApprovals(payload?.approvals || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApprovals();
  }, []);

  async function handleApprove(requestId) {
    try {
      setBusyId(requestId);
      setError("");
      await approvalService.approve(requestId);
      setMessage("Request approved.");
      loadApprovals();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(requestId) {
    try {
      setBusyId(requestId);
      setError("");
      await approvalService.reject(requestId, "Rejected via dashboard.");
      setMessage("Request rejected.");
      loadApprovals();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: "1.7rem", md: "2.1rem" } }}>
          Pending Approvals
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Role changes, large expenses, payroll runs, loan entries, and investor payouts.
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

      {!loading && approvals.length === 0 && (
        <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <CardContent>
            <Typography color="text.secondary">Nothing pending approval right now.</Typography>
          </CardContent>
        </Card>
      )}

      {approvals.map((request) => (
        <Card
          key={request.id}
          sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}
        >
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Chip size="small" label={request.requestType} color="primary" variant="outlined" />
                  <Chip size="small" label={`Requires ${request.requiredLevel}`} />
                </Stack>
                <Typography fontWeight={700}>{request.description}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Requested by {request.requestedBy}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckRounded />}
                  disabled={busyId === request.id}
                  onClick={() => handleApprove(request.id)}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<CloseRounded />}
                  disabled={busyId === request.id}
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
