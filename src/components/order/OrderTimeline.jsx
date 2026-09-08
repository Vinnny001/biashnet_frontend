import { Chip, Stack, Typography } from "@mui/material";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";

/*
|--------------------------------------------------------------------------
| Order Timeline
|--------------------------------------------------------------------------
|
| The order document never stored a real history/timeline array, so this
| derives a step list purely from the current status (matching mpesa-api's
| ORDER_STATUS progression: PENDING_PAYMENT -> PAYMENT_INITIATED -> PAID ->
| PROCESSING -> READY_FOR_DELIVERY -> OUT_FOR_DELIVERY -> COMPLETED).
| CANCELLED/REFUNDED/PARTIALLY_FULFILLED are terminal states shown on
| their own rather than forced into the happy-path list.
|
|--------------------------------------------------------------------------
*/

const HAPPY_PATH = [
  { status: "PENDING_PAYMENT", label: "Order placed", description: "Waiting for payment." },
  { status: "PAYMENT_INITIATED", label: "Payment requested", description: "M-PESA prompt sent." },
  { status: "PAID", label: "Payment confirmed", description: "Your payment has been received." },
  { status: "PROCESSING", label: "Processing", description: "Seller(s) are preparing your order." },
  { status: "READY_FOR_DELIVERY", label: "Ready for delivery", description: "Item(s) dropped off at Biashnet." },
  { status: "OUT_FOR_DELIVERY", label: "Out for delivery", description: "On its way to you." },
  { status: "COMPLETED", label: "Delivered", description: "Order complete." },
];

const TERMINAL_STATUS = {
  CANCELLED: { label: "Order cancelled", severity: "error" },
  REFUNDED: { label: "Order refunded", severity: "error" },
  PARTIALLY_FULFILLED: { label: "Partially fulfilled", severity: "warning" },
};

export default function OrderTimeline({ status }) {
  const terminal = TERMINAL_STATUS[status];

  if (terminal) {
    return <Chip label={terminal.label} color={terminal.severity} sx={{ alignSelf: "flex-start" }} />;
  }

  const currentIndex = HAPPY_PATH.findIndex((step) => step.status === status);

  return (
    <Stack spacing={2}>
      {HAPPY_PATH.map((step, index) => {
        const reached = currentIndex >= 0 && index <= currentIndex;

        return (
          <Stack key={step.status} direction="row" spacing={2} alignItems="flex-start">
            {reached ? (
              <CheckCircle color="primary" fontSize="small" sx={{ mt: 0.3 }} />
            ) : (
              <RadioButtonUnchecked color="disabled" fontSize="small" sx={{ mt: 0.3 }} />
            )}
            <div>
              <Typography fontWeight={reached ? 700 : 500} color={reached ? "text.primary" : "text.secondary"}>
                {step.label}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {step.description}
              </Typography>
            </div>
          </Stack>
        );
      })}
    </Stack>
  );
}
