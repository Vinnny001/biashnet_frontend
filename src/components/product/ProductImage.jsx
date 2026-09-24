import { Box, Skeleton } from "@mui/material";
import ImageIcon from "@mui/icons-material/ImageNotSupported";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import { useCallback, useEffect, useRef, useState } from "react";

/*
 * With no `size`, the image fills whatever box it is given — that is how
 * the product cards use it, each inside its own fixed-ratio frame.
 *
 * A `size` gives a fixed square instead, for the places that show a
 * thumbnail in a row of text: the cart and the seller's product list.
 * Without it those rows have nothing to constrain the image and it grows
 * to the full width of the page.
 *
 *
 * RECOVERING FROM A FAILED FETCH
 *
 * A plain <img> gets one chance. On a weak connection a card scrolled past
 * mid-fetch fails, and because nothing ever changes its src, the browser is
 * never asked again — scrolling back showed the same broken frame for the
 * rest of the session. So:
 *
 *   - a failure while the card is on screen retries itself, twice, backing
 *     off, since a flaky connection often recovers within a second
 *   - a failure off screen waits. Retrying cards nobody is looking at is
 *     what wastes a weak connection in the first place
 *   - scrolling back to a failed card starts a fresh round of attempts.
 *     This is the case that never used to recover
 *   - so does the connection returning, and so does tapping the frame
 *
 * Each attempt has to change the src or the browser treats it as a no-op and
 * re-requests nothing, hence the `retry` parameter.
 */

const MAX_AUTO_RETRIES = 2;

const AUTO_RETRY_DELAYS_MS = [600, 2000];

/*
 * A URL that is simply dead fails exactly like a dropped connection, and
 * scrolling a long grid back and forth would keep asking for it. After this
 * many failures the frame stops chasing it on its own; a tap, or the
 * connection coming back, still will.
 */
const MAX_ATTEMPTS_PER_IMAGE = 8;

/*
 * A fetch that neither finishes nor fails. A browser will sit on a stalled
 * image request far longer than anyone waits for it, and until it gives up
 * none of the recovery below can fire — so call it failed ourselves and let
 * them. If the original request does land afterwards, its picture is still
 * welcome: the element is still there to receive it.
 */
const STALLED_AFTER_MS = 20000;

function srcForAttempt(src, attempt) {
  if (!src || attempt === 0) return src;

  /*
   * Object and inline URLs carry no query string to add to.
   */
  if (/^(blob|data):/i.test(src)) return src;

  return `${src}${src.includes("?") ? "&" : "?"}retry=${attempt}`;
}

export default function ProductImage({
  src,
  alt = "Product image",
  size,
}) {
  const box = size
    ? { width: size, height: size, flexShrink: 0, borderRadius: 8 }
    : { width: "100%", height: "100%", minWidth: 0, minHeight: 0 };

  const [attempt, setAttempt] = useState(0);

  const [status, setStatus] = useState(src ? "loading" : "empty");

  /*
   * The observer and the online listener are set up once and read the
   * current status through this, so neither is torn down and rebuilt every
   * time an image finishes loading.
   */
  const statusRef = useRef(status);

  const frameRef = useRef(null);
  const visibleRef = useRef(true);
  const autoRetriesRef = useRef(0);
  const totalFailuresRef = useRef(0);
  const retryTimerRef = useRef(null);

  const moveTo = useCallback((next) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const retry = useCallback(() => {
    clearTimeout(retryTimerRef.current);

    statusRef.current = "loading";
    setStatus("loading");
    setAttempt((current) => current + 1);
  }, []);

  /*
   * A different product in a recycled card: start over.
   */
  useEffect(() => {
    clearTimeout(retryTimerRef.current);

    autoRetriesRef.current = 0;
    totalFailuresRef.current = 0;
    setAttempt(0);
    moveTo(src ? "loading" : "empty");
  }, [src, moveTo]);

  useEffect(
    () => () => clearTimeout(retryTimerRef.current),
    []
  );

  /*
   * A fresh round of attempts for a frame that had given up. Deliberate
   * triggers — a tap, the connection returning — go through here.
   */
  const restart = useCallback(() => {
    if (statusRef.current !== "failed") return;

    autoRetriesRef.current = 0;
    retry();
  }, [retry]);

  const restartIfWorthIt = useCallback(() => {
    if (totalFailuresRef.current >= MAX_ATTEMPTS_PER_IMAGE) return;

    restart();
  }, [restart]);

  /*
   * On screen or not — and the moment a failed card comes back into view.
   */
  useEffect(() => {
    const node = frameRef.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;

        if (entry.isIntersecting) restartIfWorthIt();
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [restartIfWorthIt]);

  useEffect(() => {
    window.addEventListener("online", restart);

    return () => window.removeEventListener("online", restart);
  }, [restart]);

  const handleError = useCallback(() => {
    moveTo("failed");

    totalFailuresRef.current += 1;

    if (
      !visibleRef.current ||
      autoRetriesRef.current >= MAX_AUTO_RETRIES
    ) {
      return;
    }

    const delay =
      AUTO_RETRY_DELAYS_MS[autoRetriesRef.current] ?? 2000;

    autoRetriesRef.current += 1;

    retryTimerRef.current = setTimeout(retry, delay);
  }, [moveTo, retry]);

  /*
   * Watchdog for a request that has gone quiet. Restarted for each attempt.
   */
  useEffect(() => {
    if (!src || status !== "loading") return undefined;

    const timer = setTimeout(handleError, STALLED_AFTER_MS);

    return () => clearTimeout(timer);
  }, [src, status, attempt, handleError]);

  const placeholder = size
    ? { borderRadius: 8 }
    : null;

  return (
    <Box
      ref={frameRef}
      sx={{
        ...box,
        position: "relative",
        bgcolor: "action.hover",
        overflow: "hidden",
      }}
    >
      {src && (
        <Box
          component="img"
          src={srcForAttempt(src, attempt)}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => moveTo("loaded")}
          onError={handleError}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",

            /*
             * Kept mounted while it loads, so a slow response that does
             * eventually arrive still has somewhere to land — and hidden
             * until then, so a half-drawn or broken image never shows.
             */
            opacity: status === "loaded" ? 1 : 0,
            transition: "opacity .2s ease",
          }}
        />
      )}

      {status === "loading" && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            ...placeholder,
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}

      {status === "failed" && (
        <Box
          role="button"
          tabIndex={-1}
          aria-label="Reload image"
          onClick={(event) => {
            /*
             * The cards wrap this in a link to the product. A tap on the
             * broken frame means "show me the picture", not "open it".
             */
            event.preventDefault();
            event.stopPropagation();

            restart();
          }}
          sx={{
            ...placeholder,
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.4,
            cursor: "pointer",
            color: "text.secondary",
          }}
        >
          <RefreshRoundedIcon fontSize="small" />

          {!size && (
            <Box component="span" sx={{ fontSize: 10, textAlign: "center" }}>
              Tap to reload
            </Box>
          )}
        </Box>
      )}

      {status === "empty" && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            color: "text.secondary",
          }}
        >
          <ImageIcon fontSize="small" />
          <Box component="span" sx={{ fontSize: 11 }}>
            No image
          </Box>
        </Box>
      )}
    </Box>
  );
}
