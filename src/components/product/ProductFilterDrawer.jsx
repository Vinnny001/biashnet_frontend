import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

const CONDITIONS = [
  "All",
  "New",
  "Used",
  "Refurbished",
];

const LOCATIONS = [
  "All",
  "Juja",
  "Nairobi",
  "Kiambu",
  "Thika",
  "Mombasa",
  "Kisumu",
];

export default function ProductFilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  onReset,
  onApply,
}) {
  const handlePriceChange = (_, value) => {
    onChange({
      ...filters,
      price: value,
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: {
            xs: "100%",
            sm: 360,
          },
          borderTopLeftRadius: {
            xs: 18,
            sm: 0,
          },
          borderBottomLeftRadius: {
            xs: 0,
            sm: 18,
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}

        <Box p={2}>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Filters
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
          }}
        >
          <Stack spacing={4}>

            {/* Price */}

            <Box>

              <Typography
                fontWeight={600}
                gutterBottom
              >
                Price Range
              </Typography>

              <Slider
                value={filters.price}
                min={0}
                max={500000}
                step={1000}
                valueLabelDisplay="auto"
                onChange={handlePriceChange}
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                KSh {filters.price[0].toLocaleString()} —
                {" "}
                KSh {filters.price[1].toLocaleString()}
              </Typography>

            </Box>

            {/* Condition */}

            <Box>

              <FormControl>

                <FormLabel>
                  Condition
                </FormLabel>

                <RadioGroup
                  value={filters.condition}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      condition: e.target.value,
                    })
                  }
                >
                  {CONDITIONS.map((item) => (
                    <FormControlLabel
                      key={item}
                      value={item}
                      control={<Radio />}
                      label={item}
                    />
                  ))}
                </RadioGroup>

              </FormControl>

            </Box>

            {/* Location */}

            <Box>

              <Typography
                fontWeight={600}
                gutterBottom
              >
                Location
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
              >
                {LOCATIONS.map((location) => (
                  <Chip
                    key={location}
                    clickable
                    label={location}
                    color={
                      filters.location === location
                        ? "primary"
                        : "default"
                    }
                    variant={
                      filters.location === location
                        ? "filled"
                        : "outlined"
                    }
                    onClick={() =>
                      onChange({
                        ...filters,
                        location,
                      })
                    }
                  />
                ))}
              </Stack>

            </Box>

            {/* Verified */}

            <FormControlLabel
              control={
                <Switch
                  checked={filters.verified}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      verified: e.target.checked,
                    })
                  }
                />
              }
              label="Verified Sellers Only"
            />

            {/* Free Delivery */}

            <FormControlLabel
              control={
                <Switch
                  checked={filters.freeDelivery}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      freeDelivery:
                        e.target.checked,
                    })
                  }
                />
              }
              label="Free Delivery"
            />

            {/* In Stock */}

            <FormControlLabel
              control={
                <Switch
                  checked={filters.inStock}
                  onChange={(e) =>
                    onChange({
                      ...filters,
                      inStock:
                        e.target.checked,
                    })
                  }
                />
              }
              label="In Stock Only"
            />

          </Stack>
        </Box>

        <Divider />

        {/* Footer */}

        <Box
          p={2}
          display="flex"
          gap={2}
        >
          <Button
            variant="outlined"
            fullWidth
            onClick={onReset}
          >
            Reset
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              onApply();
              onClose();
            }}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}