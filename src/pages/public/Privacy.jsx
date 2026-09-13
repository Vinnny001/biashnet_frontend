import { useEffect } from "react";
import { Button, Stack, Typography } from "@mui/material";
import Card from "../../components/common/Card";

/*
 * The privacy policy lives in one place: public/privacy-policy.html, a
 * static page that loads without JavaScript. That's the URL given to
 * Google Play, whose reviewers and crawler need to read it directly, and
 * keeping a single copy means the app and the store can never show two
 * different policies.
 *
 * `replace` rather than a normal navigation, so Back doesn't land on this
 * redirect and bounce the user straight back to the policy.
 */
const POLICY_URL = "/privacy-policy.html";

export default function Privacy() {
  useEffect(() => {
    window.location.replace(POLICY_URL);
  }, []);

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Privacy Policy</Typography>
      <Card>
        <Stack spacing={1.5} alignItems="flex-start">
          <Typography color="text.secondary">Opening our privacy policy…</Typography>
          <Button variant="contained" href={POLICY_URL}>
            Read the privacy policy
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
}
