import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  AccountBalanceWalletRounded,
  BadgeRounded,
  WorkRounded,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

import { useEmployee } from "../../hooks/useEmployee";
import { CURRENCY } from "../../utils/constants";
import { ROLE_LABELS } from "../../utils/employeeRoles";

/*
|--------------------------------------------------------------------------
| Per-role dashboards
|--------------------------------------------------------------------------
|
| An employee can hold several roles (e.g. techlead + logistics). Rather
| than one generic page, the dashboard renders the view for whichever role
| they're currently in — chosen at login and switchable from the sidebar.
|
| These links are a VIEW concern only. Every underlying route is still
| role-gated server-side, so showing/hiding a link grants nothing.
|
|--------------------------------------------------------------------------
*/

const ROLE_DASHBOARDS = {
  ceo: {
    headline: "Company overview",
    blurb: "Approvals waiting on you, company details, and the investor ledger.",
    links: [
      { to: "/employee/approvals", label: "Pending approvals" },
      { to: "/employee/employees", label: "Employees" },
      { to: "/employee/investors", label: "Investor ledger" },
      { to: "/employee/reports", label: "Reports" },
    ],
  },
  hr: {
    headline: "People & roles",
    blurb: "Link employees, manage positions, and raise role changes for CEO approval.",
    links: [
      { to: "/employee/employees", label: "Manage employees" },
      { to: "/employee/positions", label: "Positions" },
      { to: "/employee/reports", label: "Reports" },
    ],
  },
  accountant: {
    headline: "Finance",
    blurb: "Expenses, payroll, loans, and investor payouts.",
    links: [
      { to: "/employee/expenses", label: "Record expense" },
      { to: "/employee/payroll", label: "Run payroll" },
      { to: "/employee/loans", label: "Loans & lenders" },
      { to: "/employee/investors", label: "Investor ledger" },
      { to: "/employee/reports", label: "Reports" },
    ],
  },
  techlead: {
    headline: "Technical",
    blurb: "Platform health and technical incident reporting.",
    links: [
      { to: "/employee/reports", label: "File an incident report" },
      { to: "/employee/wallet", label: "My wallet" },
    ],
  },
  marketing: {
    headline: "Marketing",
    blurb: "Campaign updates and performance reporting.",
    links: [
      { to: "/employee/reports", label: "Campaign updates" },
      { to: "/employee/wallet", label: "My wallet" },
    ],
  },
  logistics: {
    headline: "Logistics & supply chain",
    blurb: "Confirm seller drop-offs and release orders for delivery.",
    links: [
      { to: "/employee/logistics", label: "Pending drop-offs" },
      { to: "/employee/reports", label: "Delivery discrepancy report" },
    ],
  },
  admin: {
    headline: "Administration",
    blurb: "Full access across every Biashnet work area.",
    links: [
      { to: "/employee/approvals", label: "Pending approvals" },
      { to: "/employee/employees", label: "Employees" },
      { to: "/employee/positions", label: "Positions" },
      { to: "/employee/expenses", label: "Expenses" },
      { to: "/employee/payroll", label: "Payroll" },
      { to: "/employee/logistics", label: "Logistics" },
      { to: "/employee/reports", label: "Reports" },
    ],
  },
};

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "action.hover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon color="primary" />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h6" fontWeight={800}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function EmployeeDashboard() {
  const { employee, wallet, activeRole, availableRoles, setActiveRole } = useEmployee();

  const view = ROLE_DASHBOARDS[activeRole] || ROLE_DASHBOARDS.techlead;
  const roleLabel = ROLE_LABELS[activeRole] || "Employee";

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: "1.7rem", md: "2.1rem" } }}>
            {view.headline}
          </Typography>
          <Chip label={roleLabel} color="primary" sx={{ fontWeight: 700 }} />
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {view.blurb}
        </Typography>
      </Box>

      {availableRoles.length > 1 && (
        <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              You hold more than one role — switch the view:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {availableRoles.map((role) => (
                <Chip
                  key={role}
                  label={ROLE_LABELS[role] || role}
                  color={role === activeRole ? "primary" : "default"}
                  variant={role === activeRole ? "filled" : "outlined"}
                  onClick={() => setActiveRole(role)}
                  sx={{ fontWeight: 700 }}
                />
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={AccountBalanceWalletRounded}
            label="Available Balance"
            value={`${CURRENCY.SYMBOL} ${Number(wallet?.availableBalance || 0).toLocaleString()}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={WorkRounded}
            label="Employment Status"
            value={employee?.employmentStatus || "—"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard icon={BadgeRounded} label="Employee ID" value={employee?.employeeId || "—"} />
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
        <CardContent>
          <Typography fontWeight={800} sx={{ mb: 1.5 }}>
            {roleLabel} actions
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            {view.links.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              >
                {link.label}
              </Button>
            ))}
            <Button component={Link} to="/employee/wallet" variant="outlined" size="small" sx={{ fontWeight: 600 }}>
              Wallet & withdrawals
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
