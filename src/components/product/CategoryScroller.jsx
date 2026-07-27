import { Box, Chip } from "@mui/material";

import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import ChairRoundedIcon from "@mui/icons-material/ChairRounded";
import KitchenRoundedIcon from "@mui/icons-material/KitchenRounded";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";

const ICONS = {
  All: <AppsRoundedIcon fontSize="small" />,
  Phones: <PhoneAndroidRoundedIcon fontSize="small" />,
  Electronics: <ComputerRoundedIcon fontSize="small" />,
  Fashion: <CheckroomRoundedIcon fontSize="small" />,
  Furniture: <ChairRoundedIcon fontSize="small" />,
  Kitchen: <KitchenRoundedIcon fontSize="small" />,
  Sports: <SportsSoccerRoundedIcon fontSize="small" />,
  Automotive: <DirectionsCarRoundedIcon fontSize="small" />,
  Home: <HomeRoundedIcon fontSize="small" />,
  Beauty: <LocalMallRoundedIcon fontSize="small" />,
  Health: <MedicalServicesRoundedIcon fontSize="small" />,
  Food: <RestaurantRoundedIcon fontSize="small" />,
  Services: <BuildRoundedIcon fontSize="small" />,
};

export default function CategoryScroller({
  categories = [],
  selected = "All",
  onSelect,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        py: 1,

        scrollBehavior: "smooth",

        "&::-webkit-scrollbar": {
          display: "none",
        },

        scrollbarWidth: "none",

        msOverflowStyle: "none",
      }}
    >
      {categories.map((category) => (
        <Chip
          key={category}
          clickable
          icon={ICONS[category] || <AppsRoundedIcon fontSize="small" />}
          label={category}
          onClick={() => onSelect(category)}
          color={
            selected === category
              ? "primary"
              : "default"
          }
          variant={
            selected === category
              ? "filled"
              : "outlined"
          }
          sx={{
            flexShrink: 0,

            px: 1,

            borderRadius: 5,

            fontWeight: 600,

            height: 40,

            transition: ".25s",

            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
        />
      ))}
    </Box>
  );
}