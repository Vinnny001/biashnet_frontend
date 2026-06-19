import { Stack, Typography } from "@mui/material";
import Card from "../../components/common/Card";

export default function Wishlist() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Wishlist</Typography>
      <Card>
        <Typography color="text.secondary">Saved listings will appear here.</Typography>
      </Card>
    </Stack>
  );
}
