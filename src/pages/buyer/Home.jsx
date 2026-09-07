// pages/buyer/Home.jsx

import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowForwardRounded,
  BoltRounded,
  LocationOnRounded,
} from "@mui/icons-material";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductSearch from "../../components/product/ProductSearch";
import CategoryScroller from "../../components/product/CategoryScroller";
import FeaturedSection from "../../components/product/FeaturedSection";
import FlashSaleSection from "../../components/product/FlashSaleSection";
import NewArrivalsSection from "../../components/product/NewArrivalsSection";
import RecommendedSection from "../../components/product/RecommendedSection";

import { productService } from "../../services/product.service";
import { normalizeList } from "../../utils/helpers";

import { storage } from "../../utils/storage";
import { STORAGE_KEYS } from "../../utils/constants";


const categories = [
  { id: "products", name: "Products", icon: "🛍️" },
  { id: "services", name: "Services", icon: "🛠️" },
  { id: "houses", name: "Housing", icon: "🏠" },
  { id: "adverts", name: "Adverts", icon: "📢" },
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "fashion", name: "Fashion", icon: "👕" },
  { id: "food", name: "Food", icon: "🍔" },
];


function getUser() {
  try {
    return storage.get(STORAGE_KEYS.USER) || {};
  } catch {
    return {};
  }
}


function getFirstName(user) {
  const name =
    user?.firstName ||
    user?.firstname ||
    user?.displayName ||
    user?.name ||
    "there";

  return String(name).trim().split(/\s+/)[0];
}


export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);


  /* -------------------------------------------------------
     USER
  ------------------------------------------------------- */

  useEffect(() => {
    setUser(getUser());
  }, []);


  /* -------------------------------------------------------
     PRODUCTS
  ------------------------------------------------------- */

  useEffect(() => {
    productService
      .list({ limit: 40 })
      .then((response) => {
        setProducts(normalizeList(response));
      })
      .catch((error) => {
        console.error("Home products error:", error);
      });
  }, []);


  /* -------------------------------------------------------
     SMART PRODUCT GROUPS
  ------------------------------------------------------- */

  const flashSales = useMemo(
    () =>
      products.filter(
        (item) =>
          item.flashSale ||
          item.flashSalePrice
      ),
    [products]
  );


  const featured = useMemo(
    () =>
      products.filter(
        (item) =>
          item.featured ||
          item.isFeatured ||
          item.promoted
      ),
    [products]
  );


  const recent = useMemo(
    () =>
      [...products]
        .sort((a, b) => {
          const aTime =
            a.createdAt?._seconds ||
            a.createdAt?.seconds ||
            0;

          const bTime =
            b.createdAt?._seconds ||
            b.createdAt?.seconds ||
            0;

          return bTime - aTime;
        })
        .slice(0, 16),
    [products]
  );


  const recommended = useMemo(
    () =>
      products
        .filter(
          (item) =>
            !featured.some(
              (featuredItem) =>
                featuredItem.id === item.id
            )
        )
        .slice(0, 16),
    [products, featured]
  );


  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  function openCategory(category) {
    navigate(
      `/products?category=${encodeURIComponent(category)}`
    );
  }


  function viewAll() {
    navigate("/buyer/products");
  }


  const firstName = getFirstName(user);


  return (
    <Box sx={{ pb: 6 }}>

      {/* ===================================================
          WELCOME
      =================================================== */}

      <Box sx={{ mb: 2.5 }}>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Welcome back 👋
        </Typography>

        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            fontSize: {
              xs: "1.7rem",
              sm: "2rem",
              md: "2.35rem",
            },
          }}
        >
          {firstName}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Discover great deals, trusted sellers,
          services and opportunities on Biashnet.
        </Typography>

      </Box>


      {/* ===================================================
          SEARCH
      =================================================== */}

      <Box sx={{ mb: 3 }}>
        <ProductSearch />
      </Box>


      {/* ===================================================
          CATEGORIES
      =================================================== */}

      <SectionHeader
        title="Explore categories"
        action="See all"
        onClick={viewAll}
      />

      <Box sx={{ mb: 3 }}>
        <CategoryScroller
          categories={categories}
          onCategoryClick={openCategory}
        />
      </Box>


      {/* ===================================================
          FLASH SALES
      =================================================== */}

      {flashSales.length > 0 && (
        <Box sx={{ mb: 4 }}>

          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ mb: 1 }}
          >
            <BoltRounded color="error" />

            <Typography
              variant="h6"
              fontWeight={800}
            >
              Flash Sales
            </Typography>

            <Chip
              label="Limited time"
              size="small"
              color="error"
            />
          </Stack>

          <FlashSaleSection
            products={flashSales}
          />

        </Box>
      )}


      {/* ===================================================
          FEATURED
      =================================================== */}

      <Box sx={{ mb: 4 }}>

        <SectionHeader
          title="Featured on Biashnet"
          subtitle="Popular listings worth discovering"
          action="View all"
          onClick={viewAll}
        />

        <FeaturedSection
          products={
            featured.length
              ? featured
              : products.slice(0, 12)
          }
        />

      </Box>


      {/* ===================================================
          NEAR YOU
      =================================================== */}

      <Box sx={{ mb: 4 }}>

        <SectionHeader
          title="Near you"
          subtitle={
            user?.location ||
            user?.city ||
            "Listings around your area"
          }
          icon={<LocationOnRounded color="primary" />}
          action="Explore"
          onClick={viewAll}
        />

        <FeaturedSection
          products={products.slice(0, 12)}
        />

      </Box>


      {/* ===================================================
          RECOMMENDED
      =================================================== */}

      <Box sx={{ mb: 4 }}>

        <SectionHeader
          title="Recommended for you"
          subtitle="Picks you may love"
          action="Explore"
          onClick={viewAll}
        />

        <RecommendedSection
          products={recommended}
        />

      </Box>


      {/* ===================================================
          NEW ARRIVALS
      =================================================== */}

      <Box sx={{ mb: 4 }}>

        <SectionHeader
          title="Recently added"
          subtitle="Fresh listings from sellers"
          action="See all"
          onClick={viewAll}
        />

        <NewArrivalsSection
          products={recent}
        />

      </Box>


      {/* ===================================================
          MARKETPLACE CTA
      =================================================== */}

      <Box
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 4,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >

        <Typography
          variant="h5"
          fontWeight={800}
        >
          Everything you need. One marketplace.
        </Typography>

        <Typography
          sx={{
            mt: 0.75,
            opacity: 0.9,
          }}
        >
          Buy products, find housing, discover
          services and connect with sellers.
        </Typography>

        <Button
          variant="contained"
          color="inherit"
          endIcon={<ArrowForwardRounded />}
          onClick={viewAll}
          sx={{
            mt: 2,
            fontWeight: 800,
          }}
        >
          Explore marketplace
        </Button>

      </Box>

    </Box>
  );
}


/* =========================================================
   REUSABLE SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  subtitle,
  action,
  onClick,
  icon,
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{ mb: 1.25 }}
    >

      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        sx={{ minWidth: 0 }}
      >

        {icon}

        <Box sx={{ minWidth: 0 }}>

          <Typography
            variant="h6"
            fontWeight={800}
            noWrap
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
            >
              {subtitle}
            </Typography>
          )}

        </Box>

      </Stack>

      <Button
        size="small"
        endIcon={<ArrowForwardRounded />}
        onClick={onClick}
        sx={{
          flexShrink: 0,
          fontWeight: 700,
        }}
      >
        {action}
      </Button>

    </Stack>
  );
}