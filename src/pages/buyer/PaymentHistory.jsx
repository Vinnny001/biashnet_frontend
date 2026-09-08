import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { Download } from "@mui/icons-material";

import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import { receiptService } from "../../services/receipt.service";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getErrorMessage } from "../../utils/errors";
import { normalizeList } from "../../utils/helpers";

export default function PaymentHistory() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    receiptService
      .list()
      .then((payload) => setReceipts(normalizeList(payload)))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  async function handleDownload(orderId) {
    try {
      setDownloadingId(orderId);
      setError("");
      await receiptService.downloadPdf(orderId);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to download receipt."));
    } finally {
      setDownloadingId(null);
    }
  }

  if (loading) return <Loading label="Loading payment history..." />;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700}>
          Payment history
        </Typography>
        <Typography color="text.secondary">
          Every completed payment, with a downloadable PDF receipt.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && receipts.length === 0 && (
        <Card>
          <Typography color="text.secondary">No completed payments yet.</Typography>
        </Card>
      )}

      <Stack spacing={2}>
        {receipts.map((receipt) => (
          <Card key={receipt.receiptId}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography fontWeight={700}>Order {receipt.orderId}</Typography>
                  <Chip label={receipt.paymentStatus} color="success" size="small" />
                </Stack>
                <Typography color="text.secondary" variant="body2">
                  {formatDate(receipt.paidAt)}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {(receipt.items || []).length} item{(receipt.items || []).length === 1 ? "" : "s"} · Receipt{" "}
                  {receipt.receiptNumber}
                </Typography>
              </Box>

              <Stack alignItems={{ xs: "flex-start", sm: "flex-end" }} spacing={1}>
                <Typography variant="h6" fontWeight={800} color="primary.main">
                  {formatCurrency(receipt.totalPaid)}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download />}
                  disabled={downloadingId === receipt.orderId}
                  onClick={() => handleDownload(receipt.orderId)}
                >
                  {downloadingId === receipt.orderId ? "Preparing..." : "Download PDF"}
                </Button>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
