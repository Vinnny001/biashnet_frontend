// components/product/ProductReviews.jsx
import { Avatar, Rating, Stack, Typography, Divider } from "@mui/material";
import Card from "../common/Card";

export default function ProductReviews({ reviews = [], rating = 0, count = 0 }) {
  return (
    <Card sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3 }}>
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Reviews
          </Typography>
          {count > 0 && (
            <>
              <Rating value={rating} precision={0.5} size="small" readOnly />
              <Typography variant="body2" color="text.secondary">
                {rating?.toFixed?.(1) ?? rating} ({count})
              </Typography>
            </>
          )}
        </Stack>

        {reviews.length ? (
          reviews.map((review, i) => (
            <Stack key={review.id || review._id || i} spacing={1}>
              {i > 0 && <Divider />}
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Avatar sx={{ width: 36, height: 36 }}>
                  {(review.author || "C")[0]}
                </Avatar>
                <Stack spacing={0.3} flex={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={600} variant="body2">
                      {review.author || "Customer"}
                    </Typography>
                    {review.rating != null && (
                      <Rating value={review.rating} size="small" readOnly />
                    )}
                  </Stack>
                  <Typography color="text.secondary" variant="body2">
                    {review.comment}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          ))
        ) : (
          <Typography color="text.secondary" variant="body2">
            No reviews yet — be the first to leave one.
          </Typography>
        )}
      </Stack>
    </Card>
  );
}