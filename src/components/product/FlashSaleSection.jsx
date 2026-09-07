import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import ProductCard from "./ProductCard";

const getTime = (value) =>
  value?.toDate?.()?.getTime() ||
  new Date(value || 0).getTime();

const formatTime = (ms) => {
  if (ms <= 0) return "00:00:00";

  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  return [h, m, s]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
};

export default function FlashSaleSection({
  activeProducts = [],
  previousProducts = [],
  onSeeAll,
}) {
  const [now, setNow] = useState(Date.now());

  /* Keep countdown alive */
  useEffect(() => {
    const timer = setInterval(
      () => setNow(Date.now()),
      1000
    );

    return () => clearInterval(timer);
  }, []);

  /* Remove expired sales automatically */
  const currentProducts = useMemo(
    () =>
      activeProducts.filter((product) => {
        const start = getTime(product.flashSaleStart);
        const end = getTime(product.flashSaleEnd);

        return (
          product.flashSale === true &&
          start <= now &&
          end > now &&
          Number(product.flashSalePrice) > 0
        );
      }),
    [activeProducts, now]
  );

  /* Fill empty spaces with previous sales */
  const products = useMemo(() => {
    const activeIds = new Set(
      currentProducts.map((p) => p.id || p._id)
    );

    const previous = previousProducts
      .filter(
        (p) =>
          !activeIds.has(p.id || p._id)
      )
      .slice(0, 8 - currentProducts.length);

    return [
      ...currentProducts,
      ...previous,
    ];
  }, [currentProducts, previousProducts]);

  if (!products.length) return null;

  /* Earliest active sale ending */
  const nextEnd = currentProducts.length
    ? Math.min(
        ...currentProducts
          .map((p) =>
            getTime(p.flashSaleEnd)
          )
          .filter(Boolean)
      )
    : null;

  const hasActiveSales =
    currentProducts.length > 0;

  const countdown = nextEnd
    ? formatTime(nextEnd - now)
    : null;

  return (
    <Box
      sx={{
        mb: 3,
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "#fff5f5",
        border: "1px solid #ffd6d6",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 1.5,
          py: 1.3,
          bgcolor: "#020000",
          color: "#fff",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={1}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.7}
            minWidth={0}
          >
            <LocalFireDepartmentRoundedIcon />

            <Box>
              <Typography
                fontWeight={900}
                fontSize={17}
                lineHeight={1.1}
              >
                {hasActiveSales
                  ? "Flash Sale"
                  : "Flash Sale Picks"}
              </Typography>

              <Typography
                fontSize={10}
                sx={{ opacity: 0.85 }}
              >
                {hasActiveSales
                  ? "Limited-time deals"
                  : "Popular recent offers"}
              </Typography>
            </Box>
          </Stack>

          {hasActiveSales && (
            <Chip
              icon={
                <AccessTimeRoundedIcon
                  sx={{
                    color: "#fff !important",
                  }}
                />
              }
              label={`Ends ${countdown}`}
              size="small"
              sx={{
                bgcolor: "#fff",
                color: "#d32f2f",
                fontWeight: 900,
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          )}
        </Stack>
      </Box>

      {/* PRODUCTS */}
      <Box
        sx={{
          display: "flex",
          gap: 1.2,
          overflowX: "auto",
          p: 1.3,
          pb: 1.5,
          scrollSnapType: "x mandatory",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        {products.map((product, index) => {
          const id =
            product.id || product._id;

          const isActive =
            index < currentProducts.length;

          return (
            <Box
              key={id}
              sx={{
                flex: "0 0 168px",
                scrollSnapAlign: "start",
                position: "relative",
              }}
            >
              {!isActive && (
                <Typography
                  sx={{
                    position: "absolute",
                    zIndex: 2,
                    top: 6,
                    left: 6,
                    px: 0.7,
                    py: 0.3,
                    borderRadius: 1,
                    bgcolor: "#555",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 800,
                  }}
                >
                  RECENT DEAL
                </Typography>
              )}

              <ProductCard
                product={product}
              />
            </Box>
          );
        })}
      </Box>

      {/* FOOTER */}
      {onSeeAll && (
        <Box
          sx={{
            px: 1.5,
            pb: 1.5,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            endIcon={
              <ArrowForwardRoundedIcon />
            }
            onClick={onSeeAll}
            sx={{
              minHeight: 38,
              borderRadius: 2,
              borderColor: "#d32f2f",
              color: "#d32f2f",
              fontWeight: 800,
              textTransform: "none",
            }}
          >
            See All Deals
          </Button>
        </Box>
      )}
    </Box>
  );
}