import { Stack, Typography } from "@mui/material";
import Card from "../../components/common/Card";

export default function About() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">About Biashnet</Typography>
      <Card>
        <Typography color="text.secondary">
          Biashnet connects buyers, sellers, service providers, advertisers, and housing listings in one marketplace.
        </Typography>
      </Card>
    </Stack>
  );
}
