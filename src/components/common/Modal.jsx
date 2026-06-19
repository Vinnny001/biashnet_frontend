import { Box, IconButton, Modal as MuiModal, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function Modal({ open, title, children, onClose }) {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          left: "50%",
          maxWidth: 560,
          p: 3,
          position: "absolute",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "calc(100% - 32px)"
        }}
      >
        <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </Box>
    </MuiModal>
  );
}
