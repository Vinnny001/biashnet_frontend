import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../utils/errors";

export function useFetch(fetcher, options = {}) {
  const { immediate = true, fallback = null } = options;
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState("");

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError("");
      try {
        const result = await fetcher(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(getErrorMessage(err));
        return fallback;
      } finally {
        setLoading(false);
      }
    },
    [fallback, fetcher]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
}
