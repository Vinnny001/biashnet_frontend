import axios from "axios";

import { APP_EVENTS } from "../utils/constants";

/*
|--------------------------------------------------------------------------
| RETRYING READS THROUGH A SLEEPING SERVER
|--------------------------------------------------------------------------
|
| The API runs on Render's free tier, which stops the service after a quiet
| spell and takes up to a minute to bring it back. The first request after
| that does one of three things, none of which means "there is no data":
|
|   - hangs while the service boots, until our own timeout aborts it
|   - comes back 502 / 503 from Render's edge, which is answering alone
|   - comes back 504 because the boot outlasted the edge's patience
|
| A buyer opening the storefront at that moment used to get an empty list
| and the words "No products found". So reads are retried, with a longer
| timeout each round, and the screen is told to explain the wait.
|
| ONLY READS. A POST may already have been acted on by the time its reply is
| lost — an M-PESA prompt sent, an order created, stock reserved — so
| resending it could charge a buyer twice. Writes fail and are the caller's
| to retry, deliberately.
|
|--------------------------------------------------------------------------
*/

const RETRYABLE_METHODS = new Set([
  "get",
  "head",
  "options",
]);

/*
 * Statuses worth a second try. A sleeping or restarting service answers
 * 502/503/504; 408 is the request timing out on the way. Anything else —
 * 400, 401, 404, 500 — is an answer, and repeating the question will not
 * change it.
 */
const RETRYABLE_STATUSES = new Set([
  408,
  502,
  503,
  504,
]);

/*
 * How long to wait before each retry, and how long to let that retry run.
 * The timeouts grow because a boot we have already waited through is more
 * likely to finish than to have failed — and an offline phone rejects in
 * milliseconds either way, so the generosity costs it nothing.
 */
const RETRY_DELAYS_MS = [700, 1500, 3000];
const RETRY_TIMEOUTS_MS = [30000, 45000, 45000];

const MAX_RETRIES = RETRY_DELAYS_MS.length;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isOffline() {
  return (
    typeof navigator !== "undefined" &&
    navigator.onLine === false
  );
}

function methodOf(config) {
  return String(config?.method || "get").toLowerCase();
}

/*
|--------------------------------------------------------------------------
| "THE SERVER IS WAKING UP" SIGNAL
|--------------------------------------------------------------------------
|
| Counted rather than flagged, so two screens loading at once do not have
| the first one to finish announce that the wait is over.
|
*/

let wakingRequests = 0;

export function isServerWaking() {
  return wakingRequests > 0;
}

function announce(event, detail) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(event, { detail })
  );
}

/*
 * Retries nest — each awaits the next — so one slow read passes through this
 * interceptor several times. Only the outermost of those rounds announces,
 * and only it settles: the marker below rides forward on the config to stop
 * the deeper rounds announcing again, and `announcing` in installRetry keeps
 * the rounds unwinding afterwards from settling it twice.
 *
 * A marker on the config can only travel forward, never back: a retry goes
 * out through instance.request(), which merges the config into a NEW object.
 * Primitives survive that merge by value, so a deeper round can read this
 * flag — but nothing it writes is visible to the round that sent it.
 */
function beginWaking(config, attempt) {
  config.__wakeAnnounced = true;
  wakingRequests += 1;

  announce(APP_EVENTS.SERVER_WAKING, { attempt });
}

function endWaking() {
  wakingRequests = Math.max(0, wakingRequests - 1);

  if (wakingRequests === 0) {
    announce(APP_EVENTS.SERVER_AWAKE);
  }
}

/*
 * A dropped connection and a booting service look the same from here, so
 * both are retried — but only the second is worth telling the buyer about.
 * Someone in a tunnel does not need to hear that our server is slow.
 */
function looksLikeColdStart(error) {
  if (isOffline()) return false;

  if (!error.response) {
    return (
      error.code === "ECONNABORTED" ||
      error.code === "ETIMEDOUT"
    );
  }

  return RETRYABLE_STATUSES.has(
    error.response.status
  );
}

function shouldRetry(error, config) {
  if (!config) return false;

  /*
   * A screen that navigated away, or a newer request replacing this one.
   * Honour the abort.
   */
  if (axios.isCancel?.(error)) return false;
  if (error.code === "ERR_CANCELED") return false;
  if (config.signal?.aborted) return false;

  if (!RETRYABLE_METHODS.has(methodOf(config))) return false;

  if ((config.__retryCount || 0) >= MAX_RETRIES) return false;

  /*
   * No response at all: timed out, refused, or no network. Worth another go.
   */
  if (!error.response) return true;

  return RETRYABLE_STATUSES.has(
    error.response.status
  );
}

/*
|--------------------------------------------------------------------------
| INSTALL
|--------------------------------------------------------------------------
|
| Register this LAST, after the interceptor that unwraps response.data:
| retries are re-sent through the whole chain, so what a retry resolves to
| is already unwrapped, and it must not pass the unwrapping step twice.
|
*/

export function installRetry(instance) {
  instance.interceptors.response.use(null, async (error) => {
    const config = error?.config;

    if (!shouldRetry(error, config)) return Promise.reject(error);

    const attempt = config.__retryCount || 0;

    config.__retryCount = attempt + 1;

    const announcing =
      looksLikeColdStart(error) && !config.__wakeAnnounced;

    if (announcing) beginWaking(config, config.__retryCount);

    try {
      await wait(RETRY_DELAYS_MS[attempt]);

      /*
       * A signal can be aborted while we sit in that delay.
       */
      if (config.signal?.aborted) throw error;

      config.timeout = RETRY_TIMEOUTS_MS[attempt];

      /*
       * Awaited, not just returned, so the wait below it covers every
       * further round of retrying this one sets off.
       */
      return await instance.request(config);
    } finally {
      if (announcing) endWaking();
    }
  });
}

export default installRetry;
