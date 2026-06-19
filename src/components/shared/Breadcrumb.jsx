import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
  return (
    <Breadcrumbs sx={{ mb: 2 }}>
      <Typography component={Link} to="/" color="text.secondary">
        Home
      </Typography>
      {items.map((item) =>
        item.to ? (
          <Typography key={item.label} component={Link} to={item.to} color="text.secondary">
            {item.label}
          </Typography>
        ) : (
          <Typography key={item.label} color="primary.main">
            {item.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}
