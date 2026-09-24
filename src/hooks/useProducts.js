import { useCallback, useEffect, useState } from "react";

import { productService } from "../services/product.service";
import { normalizeList } from "../utils/helpers";
import { describeRequestFailure } from "../utils/errors";

/*
 * Products, plus the three states a storefront has to tell apart:
 *
 *   loading            we have not been answered yet
 *   error              we were not answered, and gave up for now
 *   neither, empty     we were answered, and there really is nothing
 *
 * Catching the failure into an empty array collapses the last two, which is
 * what used to flash "No products found" over a marketplace that was merely
 * slow — or asleep. Only the third one may ever say that.
 */
export function useProducts(params = {}) {
  /*
   * Keyed on the values, so a caller can pass a fresh object literal every
   * render without re-requesting. The effect parses it back rather than
   * closing over the object, which guarantees the request that runs is the
   * one this key describes.
   */
  const key = JSON.stringify(params || {});

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(
    () => setReloadToken((token) => token + 1),
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    let active = true;

    setLoading(true);
    setError(null);

    productService
      .list(JSON.parse(key), { signal: controller.signal })
      .then((payload) => {
        if (!active) return;

        setProducts(normalizeList(payload));
        setError(null);
      })
      .catch((requestError) => {
        if (!active || controller.signal.aborted) return;

        /*
         * Whatever is already on screen stays there. A re-sort that fails
         * should not empty a page the buyer is reading.
         */
        setError(
          describeRequestFailure(
            requestError,
            "Couldn't load products."
          )
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [key, reloadToken]);

  /*
   * An unstable connection usually comes back on its own; take the chance
   * rather than making the buyer find the retry button.
   */
  useEffect(() => {
    if (!error) return undefined;

    window.addEventListener("online", reload);

    return () => window.removeEventListener("online", reload);
  }, [error, reload]);

  return { products, loading, error, reload };
}

export default useProducts;
