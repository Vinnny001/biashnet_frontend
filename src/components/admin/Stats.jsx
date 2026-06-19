import { Grid, Typography } from "@mui/material";
import Card from "../common/Card";

export default function Stats({ stats = [] }) {
  return (
    <Grid container spacing={2}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.label}>
          <Card>
            <Typography color="text.secondary">{stat.label}</Typography>
            <Typography variant="h4" color="primary.main">
              {stat.value}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
