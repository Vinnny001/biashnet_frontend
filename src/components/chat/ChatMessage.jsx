import { Box, Typography } from "@mui/material";

export default function ChatMessage({ message, mine = false }) {
  return (
    <Box sx={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
      <Box
        sx={{
          bgcolor: mine ? "primary.main" : "background.paper",
          border: "1px solid",
          borderColor: mine ? "primary.main" : "divider",
          borderRadius: 2,
          color: mine ? "#000" : "text.primary",
          maxWidth: "75%",
          px: 2,
          py: 1
        }}
      >
        <Typography variant="body2">{message.text || message.body}</Typography>
      </Box>
    </Box>
  );
}
