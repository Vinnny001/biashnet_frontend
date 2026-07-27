import { Box, IconButton, InputBase, Paper } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function ProductSearch({
  value,
  onChange,
  placeholder = "Search products, services, shops...",
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        px: 1.5,
        py: 0.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "all .2s ease",

        "&:hover": {
          borderColor: "primary.main",
        },

        "&:focus-within": {
          borderColor: "primary.main",
          boxShadow: (theme) =>
            `0 0 0 3px ${theme.palette.primary.main}20`,
        },
      }}
    >
      <SearchRoundedIcon
        color="action"
        sx={{
          mr: 1,
          fontSize: 22,
        }}
      />

      <InputBase
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        fullWidth
        sx={{
          fontSize: 15,
        }}
      />

      {value && (
        <IconButton
          size="small"
          onClick={() => onChange("")}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );
}