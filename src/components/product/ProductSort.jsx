import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const SORT_OPTIONS = [
  {
    value: "latest",
    label: "Latest",
  },
  {
    value: "popular",
    label: "Most Popular",
  },
  {
    value: "price_asc",
    label: "Price: Low to High",
  },
  {
    value: "price_desc",
    label: "Price: High to Low",
  },
  {
    value: "rating",
    label: "Highest Rated",
  },
  {
    value: "discount",
    label: "Biggest Discount",
  },
  {
    value: "new_arrivals",
    label: "New Arrivals",
  },
];

export default function ProductSort({
  value = "latest",
  onChange,
}) {
  return (
    <FormControl
      size="small"
      sx={{
        minWidth: {
          xs: 160,
          sm: 200,
        },
      }}
    >
      <InputLabel id="product-sort-label">
        Sort By
      </InputLabel>

      <Select
        labelId="product-sort-label"
        value={value}
        label="Sort By"
        onChange={(e) => onChange(e.target.value)}
        sx={{
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}