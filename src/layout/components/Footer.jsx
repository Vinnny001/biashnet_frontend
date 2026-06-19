import { Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { APP_NAME } from "../../utils/constants";

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: "1px solid", borderColor: "divider", mt: "auto", p: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2}>
        <Typography color="text.secondary">
          {APP_NAME} &copy; {new Date().getFullYear()}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Typography component={Link} to="/privacy" color="text.secondary">
            Privacy
          </Typography>
          <Typography component={Link} to="/terms" color="text.secondary">
            Terms
          </Typography>
          <Typography component={Link} to="/contact" color="text.secondary">
            Contact
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
