import { Button, Stack, Switch, Typography } from "@mui/material";
import Card from "../../components/common/Card";

/*
 * Google Play requires apps that let people create accounts to offer a
 * way to request account deletion from inside the app, not only on the
 * web. This links to the same static page given to Play as the "Delete
 * account URL" (public/delete-account.html), so the two can't disagree.
 * Shared by the buyer (/account/settings) and seller (/seller/settings)
 * settings screens.
 */
const DELETE_ACCOUNT_URL = "/delete-account.html";
const PRIVACY_POLICY_URL = "/privacy-policy.html";

export default function Settings() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Settings</Typography>

      <Card>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography>Email notifications</Typography>
          <Switch defaultChecked color="primary" />
        </Stack>
      </Card>

      <Card>
        <Stack spacing={1.5} alignItems="flex-start">
          <Typography variant="h6">Privacy and your data</Typography>
          <Typography color="text.secondary">
            Read how we use your data, or ask us to delete your account and the data
            linked to it.
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Button variant="outlined" href={PRIVACY_POLICY_URL}>
              Privacy policy
            </Button>
            <Button variant="outlined" color="error" href={DELETE_ACCOUNT_URL}>
              Delete my account
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
