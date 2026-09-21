import {
  Box,
  Button,
  Fab,
  Stack,
  Typography,
} from "@mui/material";

import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import ProductSearch from "../../components/product/ProductSearch";
import CategoryScroller from "../../components/product/CategoryScroller";
import ProductSort from "../../components/product/ProductSort";

import ProductFilterDrawer from "../../components/product/ProductFilterDrawer";


import FeaturedSection from "../../components/product/FeaturedSection";
import FlashSaleSection from "../../components/product/FlashSaleSection";
import NewArrivalsSection from "../../components/product/NewArrivalsSection";
import RecommendedSection from "../../components/product/RecommendedSection";

import InfiniteProductGrid from "../../components/product/InfiniteProductGrid";

import { productService } from "../../services/product.service";
import { normalizeList } from "../../utils/helpers";
import { useAuth } from "../../hooks/useAuth";

/*
 * The landing page and the public nav link here as
 * /products?category=services (and houses, adverts).
 *
 * "Products" means the whole BIASHNET marketplace,
 * so it maps to no category filter.
 */
function categoryFromUrl(value) {
  const param = String(value || "")
    .trim()
    .toLowerCase();

  if (
    !param ||
    param === "products" ||
    param === "all"
  ) {
    return "All";
  }

  return param;
}

const DEFAULT_FILTERS = {
  price: [0, 500000],
  location: "All",
  condition: "All",
  verified: false,
  freeDelivery: false,
  inStock: false,
};

export default function Products() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { user, isAuthenticated } = useAuth();

  const urlCategory = categoryFromUrl(
    searchParams.get("category")
  );

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState(urlCategory);

  /*
   * Follow the address bar.
   */
  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  const [sort, setSort] = useState("latest");

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [filters, setFilters] =
    useState(DEFAULT_FILTERS);

  /*
   * KEEPING YOUR WORKING PRODUCT LOADING LOGIC.
   */
  useEffect(() => {
    setLoading(true);

    productService
      .list({ sort })
      .then((res) =>
        setProducts(normalizeList(res))
      )
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [sort]);

  /*
   * Categories come from actual marketplace data.
   */
  const categories = useMemo(() => {
    const list = [
      ...new Set(
        products
          .map((p) => p.category)
          .filter(Boolean)
      ),
    ];

    /*
     * Keep the category from the URL visible
     * even if it currently has no listings.
     */
    if (
      category !== "All" &&
      !list.includes(category)
    ) {
      list.push(category);
    }

    return ["All", ...list];
  }, [products, category]);

  /*
   * FILTER PRODUCTS
   */
  const filteredProducts = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const productName = (
        product.name ||
        product.title ||
        ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        productName.includes(query);

      const matchesCategory =
        category === "All" ||
        String(product.category || "").toLowerCase() ===
          String(category).toLowerCase();

      const price = Number(product.price || 0);

      const matchesPrice =
        price >= filters.price[0] &&
        price <= filters.price[1];

      const matchesLocation =
        filters.location === "All" ||
        product.location ===
          filters.location;

      const matchesCondition =
        filters.condition === "All" ||
        product.condition ===
          filters.condition;

      const matchesVerified =
        !filters.verified ||
        product.verified ||
        product.sellerVerified;

      const matchesStock =
        !filters.inStock ||
        product.stock === undefined ||
        Number(product.stock) > 0;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesLocation &&
        matchesCondition &&
        matchesVerified &&
        matchesStock
      );
    });
  }, [
    products,
    search,
    category,
    filters,
  ]);

  /*
   * STOREFRONT SECTIONS
   */
  const featured = useMemo(
    () =>
      products
        .filter((p) => p.promoted)
        .slice(0, 10),
    [products]
  );

  const flashSales = useMemo(
    () =>
      products
        .filter((p) => p.flashSale)
        .slice(0, 10),
    [products]
  );

  const newArrivals = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            new Date(
              b.createdAt || 0
            ) -
            new Date(
              a.createdAt || 0
            )
        )
        .slice(0, 10),
    [products]
  );

  const recommended = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            Number(b.views || 0) -
            Number(a.views || 0)
        )
        .slice(0, 10),
    [products]
  );

  /*
   * Personalized greeting for authenticated users.
   */
  const firstName =
    user?.displayName?.split(" ")[0] ||
    user?.name?.split(" ")[0] ||
    "there";

  /*
   * Category selection updates both state
   * and the URL.
   */
  const handleCategorySelect = (value) => {
    setCategory(value);

    const params = new URLSearchParams(
      searchParams
    );

    if (value === "All") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    const query = params.toString();

    navigate(
      `/products${query ? `?${query}` : ""}`,
      {
        replace: true,
      }
    );
  };

  /*
   * YOUR EXISTING LOADING FLOW.
   *
   * We intentionally keep this outside the
   * main storefront so the existing API
   * behaviour remains unchanged.
   */
 
  return (
    <Box
      sx={{
        width: "100%",
        pb: {
          xs: 5,
          md: 7,
        },
      }}
    >
      {/* =====================================================
          STOREFRONT HERO
      ====================================================== */}

      <Box
        sx={{
          position: "relative",
          overflow: "hidden",

          mx: {
            xs: -1,
            sm: -2,
          },

          px: {
            xs: 2,
            sm: 3,
            md: 6,
          },

          py: {
            xs: 3.5,
            sm: 5,
            md: 6,
          },

          mb: {
            xs: 2.5,
            md: 4,
          },

          background:
            "linear-gradient(135deg, rgba(244,180,0,.20) 0%, rgba(244,180,0,.07) 55%, transparent 100%)",

          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1100,
            mx: "auto",
          }}
        >
          <Typography
            sx={{
              color: "primary.main",
              fontWeight: 900,
              fontSize: {
                xs: 12,
                sm: 14,
              },
              letterSpacing: 1,
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            Buy • Sell • Grow Online
          </Typography>

          <Typography
            sx={{
              fontWeight: 950,
              fontSize: {
                xs: 28,
                sm: 38,
                md: 52,
              },
              lineHeight: 1.05,
              maxWidth: 780,
            }}
          >
            {isAuthenticated
              ? `Welcome back, ${firstName} 👋`
              : "Discover more. Shop smarter. Grow with BIASHNET."}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1.5,
              maxWidth: 680,
              fontSize: {
                xs: 14,
                sm: 16,
                md: 18,
              },
              lineHeight: 1.6,
            }}
          >
            {isAuthenticated
              ? "Discover products, great deals and services from sellers on the BIASHNET marketplace."
              : "Discover products, services and great deals from sellers on the BIASHNET marketplace. Browse freely and start shopping today."}
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            sx={{
              mt: 2.5,
            }}
          >
            {/* START SHOPPING */}

            <Button
              variant="contained"
              size="large"
              startIcon={
                <ShoppingBagRoundedIcon />
              }
              endIcon={
                <ArrowForwardRoundedIcon />
              }
              onClick={() =>
                document
                  .getElementById(
                    "marketplace-products"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
              }
              sx={{
                minHeight: 46,
                px: 2.5,
              }}
            >
              Start Shopping
            </Button>

            {/* GUEST ACTIONS */}

            {!isAuthenticated && (
              <>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={
                    <PersonAddAltRoundedIcon />
                  }
                  onClick={() =>
                    navigate("/signup")
                  }
                  sx={{
                    minHeight: 46,
                  }}
                >
                  Create Account
                </Button>

                <Button
                  size="large"
                  startIcon={
                    <LoginRoundedIcon />
                  }
                  onClick={() =>
                    navigate("/login")
                  }
                  sx={{
                    minHeight: 46,
                  }}
                >
                  Log In
                </Button>
              </>
            )}
          </Stack>

          {!isAuthenticated && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1.3,
              }}
            >
              Browse the marketplace without an
              account. Create one when you're ready
              to buy, sell or track your orders.
            </Typography>
          )}
        </Box>

        {/* Decorative BIASHNET mark */}

        <Typography
          aria-hidden
          sx={{
            position: "absolute",

            right: {
              xs: -25,
              md: 20,
            },

            bottom: {
              xs: -45,
              md: -75,
            },

            fontSize: {
              xs: 160,
              md: 280,
            },

            lineHeight: 1,
            fontWeight: 950,
            color: "primary.main",
            opacity: 0.06,
            userSelect: "none",
          }}
        >
          B
        </Typography>
      </Box>

      {/* =====================================================
          MARKETPLACE CONTENT
      ====================================================== */}

      <Box
        sx={{
          px: {
            xs: 1,
            sm: 2,
          },
        }}
      >
        <Stack spacing={3}>

          {/* SEARCH */}

          <ProductSearch
            value={search}
            onChange={setSearch}
          />

          {/* CATEGORIES */}

          <Box>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: {
                  xs: 17,
                  sm: 20,
                },
                mb: 0.5,
              }}
            >
              Explore Categories
            </Typography>

            <CategoryScroller
              categories={categories}
              selected={category}
              onSelect={
                handleCategorySelect
              }
            />
          </Box>
           

        {/* FLASH SALES */}

          {flashSales.length > 0 && (
            <FlashSaleSection
              products={flashSales}
              countdown="02:18:45"
              onSeeAll={() =>
                navigate(
                  "/products?flashSale=true"
                )
              }
            />
          )}

          {/* FEATURED */}

          {featured.length > 0 && (
            <FeaturedSection
              products={featured}
              onSeeAll={() =>
                navigate(
                  "/products?promoted=true"
                )
              }
            />
          )}

          {/* NEW ARRIVALS */}

          {newArrivals.length > 0 && (
            <NewArrivalsSection
              products={newArrivals}
              onSeeAll={() =>
                navigate(
                  "/products?sort=latest"
                )
              }
            />
          )}

          {/* RECOMMENDED */}

          {recommended.length > 0 && (
            <RecommendedSection
              products={recommended}
              onSeeAll={() =>
                navigate("/products")
              }
            />
          )}

          {/* =================================================
              ALL PRODUCTS
          ================================================== */}

          <Box
            id="marketplace-products"
            sx={{
              scrollMarginTop: 80,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <ProductSort
                value={sort}
                onChange={setSort}
              />
            </Box>

            <Box sx={{ mt: 1.5 }}>
              <InfiniteProductGrid
                products={
                  filteredProducts
                }
                loading={false}
                hasMore={false}
              />
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* =====================================================
          FILTER BUTTON
      ====================================================== */}

      <Fab
        color="primary"
        aria-label="Open filters"
        onClick={() =>
          setDrawerOpen(true)
        }
        sx={{
          position: "fixed",

          right: {
            xs: 16,
            sm: 24,
          },

          bottom: {
            xs: "calc(76px + env(safe-area-inset-bottom))",
            sm: 24,
          },

          zIndex: 20,
        }}
      >
        <FilterAltRoundedIcon />
      </Fab>

      {/* =====================================================
          FILTER DRAWER
      ====================================================== */}

      <ProductFilterDrawer
        open={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
        filters={filters}
        onChange={setFilters}
        onReset={() =>
          setFilters(DEFAULT_FILTERS)
        }
        onApply={() =>
          setDrawerOpen(false)
        }
      />
    </Box>
  );
}