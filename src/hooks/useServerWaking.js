import { useEffect, useState } from "react";

import { APP_EVENTS } from "../utils/constants";
import { isServerWaking } from "../services/apiRetry";

/*
 * True while a read is being retried because the API looks like it is still
 * starting up. A screen that is loading anyway uses this to say so — a
 * minute of spinner with no explanation reads as a broken app.
 */
export function useServerWaking() {
  const [waking, setWaking] = useState(isServerWaking);

  useEffect(() => {
    const start = () => setWaking(true);
    const end = () => setWaking(false);

    window.addEventListener(APP_EVENTS.SERVER_WAKING, start);
    window.addEventListener(APP_EVENTS.SERVER_AWAKE, end);

    /*
     * A retry may have started before this screen mounted.
     */
    setWaking(isServerWaking());

    return () => {
      window.removeEventListener(APP_EVENTS.SERVER_WAKING, start);
      window.removeEventListener(APP_EVENTS.SERVER_AWAKE, end);
    };
  }, []);

  return waking;
}

export default useServerWaking;
