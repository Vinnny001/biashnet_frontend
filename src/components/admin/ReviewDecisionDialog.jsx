import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import { CheckRounded, CloseRounded } from "@mui/icons-material";

// Keep in step with PRODUCT_REVIEW_NOTE_MAX_LENGTH in the backend.
const NOTE_MAX_LENGTH = 500;

/*
 * Confirms an approve / reject decision and collects the note sent to the
 * seller: required when rejecting (they need to know what to fix),
 * optional when approving.
 *
 * Mount it only while a decision is open (key it by product and status) so
 * each decision starts with an empty note.
 */
export default function ReviewDecisionDialog({ product, status, busy = false, error = "", onCancel, onConfirm }) {
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  const rejecting = status === "rejected";
  const listing = product?.name || product?.title || "this listing";
  const trimmed = note.trim();
  const missingNote = rejecting && !trimmed;

  function handleSubmit(event) {
    event.preventDefault();
    setTouched(true);
    if (missingNote || busy) return;
    onConfirm(trimmed);
  }

  return (
    <Dialog open onClose={busy ? undefined : onCancel} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle fontWeight={800}>{rejecting ? "Reject listing" : "Approve listing"}</DialogTitle>

        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {rejecting
              ? `"${listing}" stays hidden from buyers. The seller is notified with your note so they can fix it.`
              : `"${listing}" goes live for buyers and the seller is notified.`}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            label={rejecting ? "Reason for rejecting (required)" : "Note to the seller (optional)"}
            placeholder={
              rejecting
                ? "Example: The photos show a different product from the title. Upload photos of the actual item."
                : "Example: Great photos. Consider adding the phone's storage size to the title."
            }
            value={note}
            onChange={(event) => setNote(event.target.value.slice(0, NOTE_MAX_LENGTH))}
            onBlur={() => setTouched(true)}
            error={touched && missingNote}
            helperText={
              touched && missingNote
                ? "Tell the seller why the listing was rejected."
                : `${note.length}/${NOTE_MAX_LENGTH}`
            }
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={rejecting ? "outlined" : "contained"}
            color={rejecting ? "error" : "success"}
            startIcon={rejecting ? <CloseRounded /> : <CheckRounded />}
            disabled={busy || (touched && missingNote)}
          >
            {busy ? "Saving..." : rejecting ? "Reject listing" : "Approve listing"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
