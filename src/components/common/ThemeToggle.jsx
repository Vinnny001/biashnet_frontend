import { IconButton, Tooltip } from "@mui/material";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

import { useThemeMode } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, changeTheme } = useThemeMode();

  const toggle = () => {
    changeTheme(isDark ? "light" : "dark");
  };

  return (
    <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
      <IconButton onClick={toggle}>
        {isDark ? (
          <LightModeRoundedIcon />
        ) : (
          <DarkModeRoundedIcon />
        )}
      </IconButton>
    </Tooltip>
  );
}