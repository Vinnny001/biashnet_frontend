import {
  Card,
  CardContent,
  CardActions,
  Skeleton,
  Stack,
} from "@mui/material";

export default function ProductSkeleton({
  count = 8,
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          elevation={0}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          {/* Product Image */}

          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
            }}
          />

          <CardContent
            sx={{
              flexGrow: 1,
              pb: 1,
            }}
          >
            <Stack spacing={1}>

              {/* Product Name */}

              <Skeleton
                animation="wave"
                height={22}
                width="85%"
              />

              <Skeleton
                animation="wave"
                height={22}
                width="55%"
              />

              {/* Price */}

              <Skeleton
                animation="wave"
                height={28}
                width="45%"
              />

              {/* Description */}

              <Skeleton
                animation="wave"
                height={16}
                width="100%"
              />

              <Skeleton
                animation="wave"
                height={16}
                width="80%"
              />

              {/* Seller */}

              <Skeleton
                animation="wave"
                height={18}
                width="50%"
              />

            </Stack>
          </CardContent>

          <CardActions
            sx={{
              p: 2,
              pt: 0,
              gap: 1,
            }}
          >
            <Skeleton
              animation="wave"
              variant="rounded"
              width="100%"
              height={38}
            />

            <Skeleton
              animation="wave"
              variant="rounded"
              width="100%"
              height={38}
            />
          </CardActions>
        </Card>
      ))}
    </>
  );
}