import { Box, Stack, Typography } from "@mui/material";
import Card from "../common/Card";

export default function Chart({ title = "Performance", data = [] }) {
  const max = Math.max(...data.map((item) => Number(item.value || 0)), 1);

  return (
    <Card>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Stack spacing={1.5}>
        {data.map((item) => (
          <Box key={item.label}>
            <Typography color="text.secondary" variant="body2">
              {item.label}
            </Typography>
            <Box sx={{ bgcolor: "background.default", borderRadius: 1, height: 10, mt: 0.5 }}>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  borderRadius: 1,
                  height: "100%",
                  width: `${(Number(item.value || 0) / max) * 100}%`
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
