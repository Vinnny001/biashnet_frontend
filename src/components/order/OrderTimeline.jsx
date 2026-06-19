import { Stack, Typography } from "@mui/material";

export default function OrderTimeline({ steps = [] }) {
  return (
    <Stack spacing={2}>
      {steps.map((step, index) => (
        <Stack key={step.label} direction="row" spacing={2}>
          <Typography color="primary.main" fontWeight={700}>
            {index + 1}
          </Typography>
          <div>
            <Typography>{step.label}</Typography>
            <Typography color="text.secondary" variant="body2">
              {step.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
