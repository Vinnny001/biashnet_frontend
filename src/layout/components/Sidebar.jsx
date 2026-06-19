import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar
} from "@mui/material";
import { NavLink } from "react-router-dom";

export default function Sidebar({ open, onClose, links = [], permanent = true }) {
  const drawer = (
    <Box sx={{ width: 260 }}>
      <Toolbar />
      <Divider />
      <List>
        {links.map((link) => (
          <ListItemButton
            key={link.to}
            component={NavLink}
            to={link.to}
            onClick={onClose}
            sx={{
              "&.active": {
                color: "primary.main"
              }
            }}
          >
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer open={open} onClose={onClose} sx={{ display: { xs: "block", md: "none" } }}>
        {drawer}
      </Drawer>
      {permanent ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              bgcolor: "background.default",
              borderColor: "divider",
              width: 260
            }
          }}
        >
          {drawer}
        </Drawer>
      ) : null}
    </>
  );
}
