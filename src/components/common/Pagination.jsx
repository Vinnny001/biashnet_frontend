import { Box, Pagination as MuiPagination } from "@mui/material";

export default function Pagination({ count = 1, page = 1, onChange }) {
  if (count <= 1) return null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
      <MuiPagination count={count} page={page} onChange={onChange} color="primary" />
    </Box>
  );
}
