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

import { positionService } from "../../services/position.service";
import { getErrorMessage } from "../../utils/errors";
import { CURRENCY } from "../../utils/constants";

const PAYOUT_INTERVALS = ["monthly", "quarterly", "yearly"];

const emptyForm = { name: "", stipend: "", payoutInterval: "monthly", description: "" };

export default function Positions() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadPositions() {
    try {
      setLoading(true);
      const payload = await positionService.list();
      setPositions(payload?.positions || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPositions();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await positionService.create({
        ...form,
        stipend: Number(form.stipend) || 0,
      });

      setMessage(`Position "${form.name}" created.`);
      setForm(emptyForm);
      loadPositions();
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
          Positions
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Job positions with stipend and payout interval.
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
            New position
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <TextField
                label="Stipend (KES)"
                type="number"
                required
                value={form.stipend}
                onChange={(e) => setForm({ ...form, stipend: e.target.value })}
              />
              <TextField
                select
                label="Payout Interval"
                value={form.payoutInterval}
                onChange={(e) => setForm({ ...form, payoutInterval: e.target.value })}
              >
                {PAYOUT_INTERVALS.map((interval) => (
                  <MenuItem key={interval} value={interval}>
                    {interval}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Description"
                multiline
                minRows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <Button type="submit" variant="contained" disabled={submitting} sx={{ alignSelf: "flex-start" }}>
                {submitting ? "Creating..." : "Create Position"}
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
                <TableCell>Name</TableCell>
                <TableCell>Stipend</TableCell>
                <TableCell>Interval</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && positions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary">No positions yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
              {positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell>{position.name}</TableCell>
                  <TableCell>
                    {CURRENCY.SYMBOL} {Number(position.stipend || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{position.payoutInterval}</TableCell>
                  <TableCell>{position.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Stack>
  );
}
