import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from "@mui/material";
import {
  AutoAwesomeRounded,
  CheckRounded,
  CloseRounded,
  HourglassTopRounded,
  ReportProblemRounded
} from "@mui/icons-material";
import { formatCurrency } from "../../utils/formatters";

const STATUS_COLORS = {
  pending: "warning",
  approved: "success",
  active: "success",
  rejected: "error"
};

/*
 * What the automatic policy check made of a listing, written on it by the
 * upload server. A listing only reaches this table pending if the check
 * flagged it or could not run, so the reasons are the whole point: they say
 * what to look at before approving or rejecting.
 */
function PolicyReview({ review }) {
  if (!review) return null;

  const { decision, reasons = [], summary, failed } = review;

  if (decision === "checking") {
    return (
      <Caption icon={<HourglassTopRounded sx={{ fontSize: 14 }} />} color="text.secondary">
        Being checked automatically…
      </Caption>
    );
  }

  /*
   * An automatic approval is already marked by the "auto" chip beside the
   * status, so there is nothing to add here.
   */
  if (decision !== "flag") return null;

  return (
    <Box sx={{ mt: 0.75, maxWidth: 340 }}>
      <Caption
        icon={<ReportProblemRounded sx={{ fontSize: 14 }} />}
        color={failed ? "text.secondary" : "warning.main"}
      >
        {failed ? "Not checked automatically" : "Flagged by the automatic check"}
      </Caption>

      {summary && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
          {summary}
        </Typography>
      )}

      {reasons.length > 0 && (
        <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2 }}>
          {reasons.map((reason, index) => (
            <Box component="li" key={index} sx={{ mb: 0.25 }}>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {reason.rule}
              </Typography>
              {reason.detail && (
                <Typography variant="caption" color="text.secondary">
                  {" "}
                  — {reason.detail}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 0.25 }}>
        A suggestion, not a decision — check the listing yourself.
      </Typography>
    </Box>
  );
}

function Caption({ icon, color, children }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5, color }}>
      {icon}
      <Typography variant="caption" sx={{ fontWeight: 700 }}>
        {children}
      </Typography>
    </Stack>
  );
}

export default function ProductTable({ products = [], busyId = null, onModerate }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Status</TableCell>
            {onModerate && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={onModerate ? 5 : 4}>
                <Typography color="text.secondary">No products found.</Typography>
              </TableCell>
            </TableRow>
          )}
          {products.map((product) => {
            const status = product.status || "active";
            const id = product.id || product._id;

            return (
              <TableRow key={id}>
                <TableCell>{product.name || product.title}</TableCell>
                <TableCell>{product.category || "General"}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>
                  <Chip size="small" label={status} color={STATUS_COLORS[status] || "default"} />
                  {product.reviewNote && status !== "pending" && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, maxWidth: 280 }}>
                      Note: {product.reviewNote}
                    </Typography>
                  )}

                  {product.reviewedBy === "ai" && status !== "pending" && (
                    <Tooltip title="Approved by the automatic policy check, with no admin involved">
                      <Chip
                        size="small"
                        variant="outlined"
                        color="success"
                        icon={<AutoAwesomeRounded />}
                        label="auto"
                        sx={{ mt: 0.5, height: 20, fontSize: 10 }}
                      />
                    </Tooltip>
                  )}

                  <PolicyReview review={product.policyReview} />
                </TableCell>
                {onModerate && (
                  <TableCell>
                    {status === "pending" ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckRounded />}
                          disabled={busyId === id}
                          onClick={() => onModerate(id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CloseRounded />}
                          disabled={busyId === id}
                          onClick={() => onModerate(id, "rejected")}
                        >
                          Reject
                        </Button>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
