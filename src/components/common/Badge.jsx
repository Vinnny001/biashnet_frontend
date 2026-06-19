import { Chip } from "@mui/material";

export default function Badge({ label, color = "primary", ...props }) {
  return <Chip size="small" label={label} color={color} variant="outlined" {...props} />;
}
