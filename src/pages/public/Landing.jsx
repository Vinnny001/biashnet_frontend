import { Box, Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import CampaignIcon from "@mui/icons-material/Campaign";

const categories = [
  { label: "Products", description: "Buy and sell physical goods", icon: StorefrontIcon, to: "/products?category=products" },
  { label: "Services", description: "Find skilled professionals", icon: MiscellaneousServicesIcon, to: "/products?category=services" },
  { label: "Houses", description: "Rent or buy property", icon: HomeWorkIcon, to: "/products?category=houses" },
  { label: "Adverts", description: "Promote your business", icon: CampaignIcon, to: "/products?category=adverts" }
];

const fallbackListings = [
  { id: 1, name: "Starter Pack", price: 2500, category: "Subscription" },
  { id: 2, name: "Featured Service", price: 5000, category: "Services" },
  { id: 3, name: "Prime Listing", price: 45000, category: "Houses" },
  { id: 4, name: "Advert Slot", price: 1500, category: "Adverts" }
];

export default function Landing() {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          minHeight: { xs: 320, md: 420 },
          display: "flex",
          alignItems: "center",
          px: { xs: 3, md: 8 },
          py: { xs: 6, md: 0 },
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main || theme.palette.primary.light} 100%)`
        }}
      >
        <Stack spacing={3} sx={{ maxWidth: 580 }}>
          <Typography
            variant="h2"
            sx={{ fontWeight: 800, color: "#fff", lineHeight: 1.15 }}
          >
            Juja's marketplace for everything
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "1.1rem" }}>
            Buy products, hire services, find housing, and post adverts — all in one place with verified sellers.
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              sx={{ bgcolor: "#fff", color: "primary.main", fontWeight: 700, "&:hover": { bgcolor: "grey.100" } }}
            >
              Get started
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{ borderColor: "rgba(255,255,255,0.6)", color: "#fff", "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.1)" } }}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ px: { xs: 2, md: 6 }, py: 6 }}>
        {/* Categories */}
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Browse by category
        </Typography>
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {categories.map(({ label, description, icon: Icon, to }) => (
            <Grid item xs={6} md={3} key={label}>
              <Card
                component={Link}
                to={to}
                sx={{
                  textDecoration: "none",
                  display: "block",
                  height: "100%",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  "&:hover": { transform: "translateY(-3px)", boxShadow: 4 }
                }}
              >
                <CardContent>
                  <Icon color="primary" sx={{ fontSize: 36, mb: 1 }} />
                  <Typography variant="h6" fontWeight={700}>{label}</Typography>
                  <Typography variant="body2" color="text.secondary">{description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Featured listings */}
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Featured listings
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {fallbackListings.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">{item.category}</Typography>
                  <Typography variant="h6" fontWeight={600} sx={{ mt: 0.5 }}>{item.name}</Typography>
                  <Typography color="primary" fontWeight={700}>KES {item.price.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA strip */}
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 2,
            borderRadius: 3,
            bgcolor: "action.hover"
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            Ready to start selling?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Create a free account and reach buyers across Kenya.
          </Typography>
          <Button component={Link} to="/signup" variant="contained" size="large">
            Create free account
          </Button>
        </Box>
      </Box>
    </Box>
  );
}