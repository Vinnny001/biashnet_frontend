import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function Filter({ label = "Category", value = "", options = [], onChange }) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={(event) => onChange?.(event.target.value)}>
        <MenuItem value="">All</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value || option} value={option.value || option}>
            {option.label || option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
