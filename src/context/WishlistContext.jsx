// src/context/WishlistContext.jsx
import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { wishlistService } from "../services/wishlist.service";
import { useAuth } from "../hooks/useAuth";
import { USER_ROLES } from "../utils/constants";

export const WishlistContext = createContext(null);

/*
 * Which listings the signed-in buyer has liked.
 *
 * Only a buyer account can like: a seller signed into their own account
 * would otherwise be liking their own listings, and a visitor has no
 * account to like with — they are sent to sign in instead. The server
 * enforces the same rule, so this is about what the UI offers, not about
 * security.
 */
export function WishlistProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const canLike = Boolean(isAuthenticated) && user?.role === USER_ROLES.BUYER;

  const [likedIds, setLikedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  /*
   * Counts the server has told us since this page loaded. The listing
   * itself carries likeCount, which is what everyone (signed in or not)
   * sees; this just keeps the number honest the moment someone taps.
   */
  const [likeCounts, setLikeCounts] = useState({});

  const refresh = useCallback(async () => {
    if (!canLike) {
      setLikedIds([]);
      return;
    }

    setLoading(true);
    try {
      const response = await wishlistService.ids();
      const ids = response?.data ?? response ?? [];
      setLikedIds(Array.isArray(ids) ? ids : []);
    } catch {
      // A failed load leaves the hearts empty rather than breaking the page.
    } finally {
      setLoading(false);
    }
  }, [canLike]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isLiked = useCallback(
    (productId) => likedIds.includes(productId),
    [likedIds]
  );

  /*
   * The heart fills straight away and is put back if the server refuses —
   * a like isn't worth making someone wait for a round trip.
   */
  const toggle = useCallback(
    async (productId) => {
      if (!canLike || !productId) return false;

      const liked = likedIds.includes(productId);

      setLikedIds((current) =>
        liked ? current.filter((id) => id !== productId) : [...current, productId]
      );

      try {
        const response = liked
          ? await wishlistService.remove(productId)
          : await wishlistService.add(productId);

        const count = response?.data?.likeCount;
        if (typeof count === "number") {
          setLikeCounts((current) => ({ ...current, [productId]: count }));
        }

        return !liked;
      } catch {
        setLikedIds((current) =>
          liked ? [...current, productId] : current.filter((id) => id !== productId)
        );
        return liked;
      }
    },
    [canLike, likedIds]
  );

  /*
   * How many people like a listing. Public — a visitor sees it too; they
   * just can't add to it without signing in.
   */
  const likeCountOf = useCallback(
    (product) => {
      const id = product?.id || product?._id;
      const known = id ? likeCounts[id] : undefined;
      return typeof known === "number" ? known : Number(product?.likeCount || 0);
    },
    [likeCounts]
  );

  const value = useMemo(
    () => ({
      canLike,
      likedIds,
      count: likedIds.length,
      loading,
      isLiked,
      toggle,
      refresh,
      likeCountOf,
    }),
    [canLike, likedIds, loading, isLiked, toggle, refresh, likeCountOf]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
