import { Button, Stack, Typography } from "@mui/material";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";

export default function Contact() {
  return (
    <Stack spacing={2} sx={{ maxWidth: 640 }}>
      <Typography variant="h4">Contact</Typography>
      <Card>
        <Stack component="form" spacing={1}>
          <Input label="Name" />
          <Input label="Email" type="email" />
          <Input label="Message" multiline minRows={4} />
          <Button variant="contained">Send message</Button>
        </Stack>
      </Card>
    </Stack>
  );
}
