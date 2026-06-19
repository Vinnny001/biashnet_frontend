import { Grid } from "@mui/material";
import Filter from "../shared/Filter";
import SearchBar from "../shared/SearchBar";
import Sort from "../shared/Sort";

export default function FilterForm({ category, sort, onCategoryChange, onSortChange }) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <SearchBar />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Filter
          value={category}
          onChange={onCategoryChange}
          options={["products", "services", "houses", "adverts"]}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Sort value={sort} onChange={onSortChange} />
      </Grid>
    </Grid>
  );
}
