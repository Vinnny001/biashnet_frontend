import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CheckRounded, FlagRounded } from "@mui/icons-material";

import { reportService } from "../../services/report.service";
import { useEmployee } from "../../hooks/useEmployee";
import { getErrorMessage } from "../../utils/errors";

const REPORT_TYPES_BY_ROLE = {
  hr: ["hr-update"],
  accountant: ["reconciliation"],
  techlead: ["incident"],
  marketing: ["campaign-update"],
  logistics: ["delivery-discrepancy"],
  ceo: ["executive-summary"],
};

const REPORT_TYPE_LABELS = {
  "hr-update": "HR Update",
  "reconciliation": "Financial Reconciliation",
  "incident": "Technical Incident",
  "campaign-update": "Marketing Campaign Update",
  "delivery-discrepancy": "Delivery Discrepancy",
  "executive-summary": "Executive Summary",
};

const STATUS_COLORS = {
  submitted: "warning",
  acknowledged: "success",
  flagged: "error",
};

export default function Reports() {
  const { employeeRoles, hasRole } = useEmployee();
  const isManager = hasRole("hr", "ceo", "admin");

  const allowedTypes = useMemo(() => {
    if (employeeRoles.admin) return Object.values(REPORT_TYPES_BY_ROLE).flat();
    return Object.entries(REPORT_TYPES_BY_ROLE)
      .filter(([role]) => employeeRoles[role])
      .flatMap(([, types]) => types);
  }, [employeeRoles]);

  const [myReports, setMyReports] = useState([]);
  const [teamReports, setTeamReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ type: "", title: "", summary: "" });
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadReports() {
    try {
      setLoading(true);
      const requests = [reportService.listMine()];
      if (isManager) requests.push(reportService.listAll({ status: "submitted" }));

      const [minePayload, teamPayload] = await Promise.all(requests);
      setMyReports(minePayload?.reports || []);
      setTeamReports(teamPayload?.reports || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManager]);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      setMessage("");
      await reportService.create(form);
      setMessage("Report submitted.");
      setForm({ type: "", title: "", summary: "" });
      loadReports();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReview(reportId, decision) {
    try {
      setBusyId(reportId);
      setError("");
      await reportService.review(reportId, { decision });
      setMessage(decision === "acknowledged" ? "Report acknowledged." : "Report flagged.");
      loadReports();
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
          Reports
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          File a report for your role, or review reports from your team.
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
            File a report
          </Typography>

          {allowedTypes.length === 0 ? (
            <Typography color="text.secondary">
              None of your current roles have a report type assigned yet.
            </Typography>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  select
                  label="Report type"
                  required
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {allowedTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {REPORT_TYPE_LABELS[type] || type}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Title"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <TextField
                  label="Summary"
                  multiline
                  minRows={3}
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                />
                <Button type="submit" variant="contained" disabled={submitting} sx={{ alignSelf: "flex-start" }}>
                  {submitting ? "Submitting..." : "Submit Report"}
                </Button>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {isManager && (
        <>
          <Typography variant="h6" fontWeight={800}>
            Team reports awaiting review
          </Typography>

          {!loading && teamReports.length === 0 && (
            <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
              <CardContent>
                <Typography color="text.secondary">Nothing awaiting review right now.</Typography>
              </CardContent>
            </Card>
          )}

          {teamReports.map((report) => (
            <Card
              key={report.id}
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
                      <Chip size="small" label={REPORT_TYPE_LABELS[report.type] || report.type} color="primary" variant="outlined" />
                      <Chip size="small" label={report.status} color={STATUS_COLORS[report.status]} />
                    </Stack>
                    <Typography fontWeight={700}>{report.title}</Typography>
                    {report.summary && (
                      <Typography variant="body2" color="text.secondary">
                        {report.summary}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      From {report.employeeId}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<CheckRounded />}
                      disabled={busyId === report.id}
                      onClick={() => handleReview(report.id, "acknowledged")}
                    >
                      Acknowledge
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<FlagRounded />}
                      disabled={busyId === report.id}
                      onClick={() => handleReview(report.id, "flagged")}
                    >
                      Flag
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}

          <Divider />
        </>
      )}

      <Typography variant="h6" fontWeight={800}>
        My reports
      </Typography>

      {!loading && myReports.length === 0 && (
        <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <CardContent>
            <Typography color="text.secondary">You haven't filed any reports yet.</Typography>
          </CardContent>
        </Card>
      )}

      {myReports.map((report) => (
        <Card
          key={report.id}
          sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}
        >
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Chip size="small" label={REPORT_TYPE_LABELS[report.type] || report.type} color="primary" variant="outlined" />
              <Chip size="small" label={report.status} color={STATUS_COLORS[report.status]} />
            </Stack>
            <Typography fontWeight={700}>{report.title}</Typography>
            {report.summary && (
              <Typography variant="body2" color="text.secondary">
                {report.summary}
              </Typography>
            )}
            {report.reviewNotes && (
              <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                Reviewer note: {report.reviewNotes}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
