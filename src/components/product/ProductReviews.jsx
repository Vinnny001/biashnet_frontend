// components/product/ProductReviews.jsx
import { useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Divider,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import Card from "../common/Card";
import { productService } from "../../services/product.service";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../utils/errors";
import { USER_ROLES } from "../../utils/constants";

export default function ProductReviews({
  reviews = [],
  rating = 0,
  count = 0,
  productId,
  canReview = false,
  onReviewSaved,
}) {
  const { isAuthenticated } = useAuth();

  /*
   * What shoppers wrote is for people with an account. The star rating
   * and how many there are stay visible, so a visitor can still judge the
   * listing at a glance and knows what signing in gets them.
   */
  if (!isAuthenticated) {
    return (
      <Card sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3 }}>
        <Stack spacing={2}>
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

          <Alert
            severity="info"
            sx={{ borderRadius: 2 }}
            action={
              <Button component={Link} to="/login" size="small" sx={{ fontWeight: 700 }}>
                Sign in
              </Button>
            }
          >
            {count > 0
              ? `Sign in to read ${count === 1 ? "the review" : `all ${count} reviews`} for this product.`
              : "Sign in to read reviews for this product."}
          </Alert>
        </Stack>
      </Card>
    );
  }

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

        <ReviewForm productId={productId} canReview={canReview} onSaved={onReviewSaved} />

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

/*
 * Only a buyer who has actually received this product can review it, which
 * is what keeps invented reviews out. A buyer who hasn't bought it is told
 * what unlocks the form; a seller or admin sees nothing. Visitors never
 * reach here — they're asked to sign in for the whole section above. The
 * server enforces all of this too.
 */
function ReviewForm({ productId, canReview, onSaved }) {
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!productId) return null;

  if (user?.role !== USER_ROLES.BUYER) return null;

  if (!canReview) {
    return (
      <Typography color="text.secondary" variant="body2">
        You can review this product once an order you placed for it has been delivered.
      </Typography>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!rating) {
      setError("Choose a star rating first.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const result = await productService.addReview(productId, { rating, comment });

      setMessage(result?.message || "Thanks for your review.");
      setComment("");
      onSaved?.();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} spacing={1.5}>
      {message && (
        <Alert severity="success" onClose={() => setMessage("")} sx={{ borderRadius: 2 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError("")} sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" spacing={1.5} alignItems="center">
        <Typography variant="body2" fontWeight={700}>
          Your rating
        </Typography>
        <Rating
          value={rating}
          onChange={(_, value) => setRating(value || 0)}
          size="medium"
        />
      </Stack>

      <TextField
        label="Your review (optional)"
        placeholder="How was the product? Was it as described?"
        value={comment}
        onChange={(event) => setComment(event.target.value.slice(0, 1000))}
        multiline
        minRows={2}
        fullWidth
        helperText={`${comment.length}/1000`}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={saving}
        sx={{ alignSelf: "flex-start", fontWeight: 700, borderRadius: 2 }}
      >
        {saving ? "Sending..." : "Post review"}
      </Button>

      <Divider />
    </Stack>
  );
}
