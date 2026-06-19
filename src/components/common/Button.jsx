import { Button as MuiButton } from "@mui/material";

export default function Button({ children, ...props }) {
  return (
    <MuiButton variant="contained" color="primary" {...props}>
      {children}
    </MuiButton>
  );
}
