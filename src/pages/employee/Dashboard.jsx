import {
  Box,
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

const ROLE_LABELS = {
  ceo: "CEO",
  hr: "HR",
  accountant: "Accountant",
  techlead: "Tech Lead",
  marketing: "Marketing",
  admin: "Admin",
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
  const { employee, wallet, employeeRoles } = useEmployee();

  const activeRoles = Object.entries(employeeRoles || {})
    .filter(([, active]) => active)
    .map(([role]) => ROLE_LABELS[role] || role);

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={900} sx={{ fontSize: { xs: "1.7rem", md: "2.1rem" } }}>
          Employee Dashboard
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Your profile, position, and wallet at a glance.
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {activeRoles.length ? (
          activeRoles.map((role) => (
            <Chip key={role} label={role} color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
          ))
        ) : (
          <Chip label="Employee" variant="outlined" />
        )}
      </Stack>

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
          <Typography fontWeight={800} sx={{ mb: 1 }}>
            Quick links
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Link to="/employee/wallet">Wallet & Withdrawals</Link>
            <Link to="/employee/investors">Investor Ledger</Link>
            {employeeRoles?.hr || employeeRoles?.admin ? (
              <Link to="/employee/employees">Manage Employees</Link>
            ) : null}
            {employeeRoles?.accountant || employeeRoles?.admin ? (
              <Link to="/employee/expenses">Record Expense</Link>
            ) : null}
            {employeeRoles?.admin || employeeRoles?.ceo ? (
              <Link to="/employee/approvals">Pending Approvals</Link>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
