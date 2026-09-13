import { Alert, Link as MuiLink } from "@mui/material";

import { SELLER_LISTING_POLICY_URL } from "../../utils/constants";

/*
 * Shown on the add and edit product screens. Every listing is reviewed
 * against the seller listing policy before buyers can see it, so sellers
 * can read the rules before they submit.
 *
 * Opens in a new tab / the phone's browser rather than navigating, because
 * leaving these screens would throw away whatever the seller has typed.
 */
export default function ListingPolicyNote({ editing = false }) {
  return (
    <Alert severity="info" sx={{ borderRadius: 2 }}>
      {editing
        ? "Changing photos or text sends your listing back for review, and it's hidden from buyers until approved. Price and stock changes don't need review. "
        : "Your listing will be reviewed before buyers can see it. "}
      <MuiLink href={SELLER_LISTING_POLICY_URL} target="_blank" rel="noopener noreferrer" fontWeight={700}>
        Read the seller listing policy
      </MuiLink>
    </Alert>
  );
}
