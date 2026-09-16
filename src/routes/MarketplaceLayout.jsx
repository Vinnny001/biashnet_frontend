import { useAuth } from "../hooks/useAuth";
import BuyerLayout from "../layout/BuyerLayout";
import GuestLayout from "../layout/GuestLayout";
import Loading from "../components/common/Loading";

/*
 * The public marketplace — the landing page, product lists, a single
 * product, search, cart and wishlist — is open to visitors, so it can't be
 * wrapped in buyer chrome by default: a visitor who hasn't signed in was
 * being shown the buyer's notifications bell, chat and profile menu, none
 * of which are theirs.
 *
 * Signed in, these pages keep the buyer layout they had. Signed out, they
 * get the same public layout as the landing page.
 */
export default function MarketplaceLayout() {
  const { isAuthenticated, loading } = useAuth();

  // Until the session is known, showing either layout would flash the wrong one.
  if (loading) return <Loading label="Loading" />;

  return isAuthenticated ? <BuyerLayout /> : <GuestLayout />;
}
