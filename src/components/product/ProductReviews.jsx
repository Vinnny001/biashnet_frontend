import { Stack, Typography } from "@mui/material";
import Card from "../common/Card";

export default function ProductReviews({ reviews = [] }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Reviews</Typography>
      {reviews.length ? (
        reviews.map((review) => (
          <Card key={review.id || review._id}>
            <Typography fontWeight={700}>{review.author || "Customer"}</Typography>
            <Typography color="text.secondary">{review.comment}</Typography>
          </Card>
        ))
      ) : (
        <Typography color="text.secondary">No reviews yet.</Typography>
      )}
    </Stack>
  );
}
