import { Alert as MuiAlert } from "@mui/material";

export default function Alert({ severity = "info", children, ...props }) {
  return (
    <MuiAlert severity={severity} variant="outlined" {...props}>
      {children}
    </MuiAlert>
  );
}
