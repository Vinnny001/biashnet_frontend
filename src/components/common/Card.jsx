import { Card as MuiCard, CardContent } from "@mui/material";

export default function Card({ children, sx, contentSx, ...props }) {
  return (
    <MuiCard sx={{ borderRadius: 2, ...sx }} {...props}>
      <CardContent sx={contentSx}>{children}</CardContent>
    </MuiCard>
  );
}
