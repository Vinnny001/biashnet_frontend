import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "price_asc", label: "Price low to high" },
  { value: "price_desc", label: "Price high to low" }
];

export default function Sort({ value = "latest", onChange }) {
  return (
    <FormControl fullWidth>
      <InputLabel>Sort</InputLabel>
      <Select label="Sort" value={value} onChange={(event) => onChange?.(event.target.value)}>
        {sortOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
