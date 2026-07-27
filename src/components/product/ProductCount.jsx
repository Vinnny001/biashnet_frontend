import {
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export default function ProductCount({
  count = 0,
  total,
  category = "All",
}) {
  return (
    <Box
      sx={{
        py: 1,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        rowGap={1}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Inventory2OutlinedIcon
            color="primary"
            fontSize="small"
          />

          <Typography
            variant="body1"
            fontWeight={600}
          >
            {count.toLocaleString()} Product
            {count !== 1 ? "s" : ""}
          </Typography>

          {total !== undefined &&
            total !== count && (
              <Typography
                variant="body2"
                color="text.secondary"
              >
                of {total.toLocaleString()}
              </Typography>
            )}
        </Stack>

        <Chip
          label={`Category: ${category}`}
          color="primary"
          variant="outlined"
          sx={{
            borderRadius: 5,
            fontWeight: 600,
          }}
        />
      </Stack>
    </Box>
  );
}