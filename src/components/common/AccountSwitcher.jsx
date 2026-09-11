import { useState } from "react";
import { Divider, ListItemIcon, MenuItem, Typography } from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LockIcon from "@mui/icons-material/Lock";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import {
  ACCOUNT_TYPE_LABELS,
  ROLE_HOME,
  requiresReLogin
} from "../../utils/roleRoutes";

/*
|--------------------------------------------------------------------------
| Account Switcher
|--------------------------------------------------------------------------
|
| Renders as menu items so it can be dropped straight into the existing
| profile <Menu> in each layout.
|
| Buyer <-> seller switch instantly (no re-auth needed — those skip OTP at
| login anyway). Admin / Investor / Work accounts are OTP-protected, so
| they're shown but route to a fresh sign-in rather than switching in
| place; the backend rejects a direct switch to them either way.
|
|--------------------------------------------------------------------------
*/

export default function AccountSwitcher({ onDone }) {
  const { user, switchAccount } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const accountTypes = user?.accountTypes || [];
  const current = user?.role;

  if (accountTypes.length < 2) return null;

  async function handleSelect(accountType) {
    if (accountType === current || busy) return;

    if (requiresReLogin(accountType)) {
      onDone?.();
      navigate("/login", { state: { accountType } });
      return;
    }

    try {
      setBusy(true);
      setError("");
      const nextUser = await switchAccount(accountType);
      onDone?.();
      navigate(ROLE_HOME[nextUser?.role] || "/", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Couldn't switch account. Please sign in again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Divider />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ px: 2, py: 0.5, display: "block", fontWeight: 700 }}
      >
        Switch account
      </Typography>

      {accountTypes.map((type) => {
        const isCurrent = type === current;
        const locked = !isCurrent && requiresReLogin(type);

        return (
          <MenuItem
            key={type}
            selected={isCurrent}
            disabled={busy}
            onClick={() => handleSelect(type)}
          >
            <ListItemIcon>
              {isCurrent ? (
                <CheckIcon fontSize="small" color="primary" />
              ) : locked ? (
                <LockIcon fontSize="small" />
              ) : (
                <SwapHorizIcon fontSize="small" />
              )}
            </ListItemIcon>
            {ACCOUNT_TYPE_LABELS[type] || type}
            {locked && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                sign in
              </Typography>
            )}
          </MenuItem>
        );
      })}

      {error && (
        <Typography variant="caption" color="error" sx={{ px: 2, py: 0.5, display: "block" }}>
          {error}
        </Typography>
      )}
    </>
  );
}
