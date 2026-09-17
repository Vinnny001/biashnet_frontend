// src/context/CartContext.jsx
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { cartService } from "../services/cart.service";
import { useAuth } from "../hooks/useAuth"; // adjust import if your auth hook lives elsewhere

export const CartContext = createContext(null);

function normalizeServerItem(item) {
  return {
    id: item.id,
    productId: item.productId,
    title: item.title,
    image: item.image,
    price: item.price,
    category: item.category,
    quantity: item.quantity,
    sellerId: item.sellerId
  };
}

export function CartProvider({ children }) {
  const { user } = useAuth(); // expects { user } with user === null when logged out
  const [localItems, setLocalItems] = useLocalStorage(STORAGE_KEYS.CART, []);
  const [serverItems, setServerItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasMergedRef = useRef(false);

  /*
   * Bumped by every local change to the cart. A reload that was already
   * in flight when the change happened is answering an older question,
   * and applying it makes the badge jump backwards — 11, then 10, then 11
   * again as the newer reload lands. Such a reply is dropped; the reload
   * that follows the change brings the truth.
   */
  const changeCountRef = useRef(0);

  const isLoggedIn = Boolean(user);

  const refreshServerCart = useCallback(async () => {
    const asOf = changeCountRef.current;

    setLoading(true);
    try {
      const res = await cartService.list();

      if (changeCountRef.current !== asOf) return;

      const list = res?.data ?? res ?? [];
      setServerItems(Array.isArray(list) ? list.map(normalizeServerItem) : []);
    } catch {
      // leave serverItems as-is on failure; don't wipe the UI
    } finally {
      setLoading(false);
    }
  }, []);

  // on login: merge any local guest cart into the server cart once, then load server cart
  useEffect(() => {
    if (!isLoggedIn) {
      hasMergedRef.current = false;
      return;
    }
    if (hasMergedRef.current) return;
    hasMergedRef.current = true;

    (async () => {
      try {
        if (localItems.length > 0) {
          await cartService.merge(localItems);
          setLocalItems([]); // clear guest cart after merging
        }
      } catch {
        // merge failure shouldn't block loading the existing server cart
      }
      await refreshServerCart();
    })();
  }, [isLoggedIn, localItems, refreshServerCart, setLocalItems]);

  const addItem = useCallback(
    async (product, quantity = 1) => {
      const productId = product.id || product._id || product.productId;

      if (!isLoggedIn) {
        setLocalItems((current) => {
          const existing = current.find((item) => item.id === productId);
          if (existing) {
            return current.map((item) =>
              item.id === productId ? { ...item, quantity: item.quantity + quantity } : item
            );
          }
          return [...current, { ...product, id: productId, quantity }];
        });
        return;
      }

      /*
       * Show it in the cart badge straight away. Waiting for the save and
       * then a reload of the whole cart made adding an item feel broken —
       * two round trips before the number moved. The reload still runs and
       * corrects this (prices, ids, merged quantities); a failure puts the
       * badge back where it was.
       */
      changeCountRef.current += 1;

      setServerItems((current) => {
        const existing = current.find((item) => item.productId === productId);

        if (existing) {
          return current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Number(item.quantity || 0) + quantity }
              : item
          );
        }

        return [
          ...current,
          {
            id: `pending-${productId}`,
            productId,
            title: product.title || product.name,
            image: product.images?.[0]?.thumb || product.image,
            price: product.price,
            category: product.category,
            quantity,
            sellerId: product.sellerId,
          },
        ];
      });

      try {
        await cartService.addItem(productId, quantity);
      } catch {
        // optionally surface a notification here via your NotificationContext
      } finally {
        await refreshServerCart();
      }
    },
    [isLoggedIn, refreshServerCart, setLocalItems]
  );

  const updateQuantity = useCallback(
    async (id, quantity) => {
      if (!isLoggedIn) {
        setLocalItems((current) =>
          quantity <= 0
            ? current.filter((item) => item.id !== id)
            : current.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
        return;
      }

      changeCountRef.current += 1;

      setServerItems((current) =>
        quantity <= 0
          ? current.filter((item) => item.id !== id)
          : current.map((item) => (item.id === id ? { ...item, quantity } : item))
      );

      try {
        await cartService.updateQuantity(id, quantity);
      } catch {
        // optionally notify
      } finally {
        await refreshServerCart();
      }
    },
    [isLoggedIn, refreshServerCart, setLocalItems]
  );

  const removeItem = useCallback(
    async (id) => {
      if (!isLoggedIn) {
        setLocalItems((current) => current.filter((item) => item.id !== id));
        return;
      }

      changeCountRef.current += 1;

      setServerItems((current) => current.filter((item) => item.id !== id));

      try {
        await cartService.removeItem(id);
      } catch {
        // optionally notify
      } finally {
        await refreshServerCart();
      }
    },
    [isLoggedIn, refreshServerCart, setLocalItems]
  );

  const clearCart = useCallback(async () => {
    if (!isLoggedIn) {
      setLocalItems([]);
      return;
    }
    changeCountRef.current += 1;
    setServerItems([]);

    try {
      await cartService.clear();
    } catch {
      // optionally notify
    }
  }, [isLoggedIn, setLocalItems]);

  const items = isLoggedIn ? serverItems : localItems;

  const value = useMemo(
    () => ({
      items,
      loading,
      count: items.reduce((total, item) => total + Number(item.quantity || 0), 0),
      total: items.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
      ),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      refresh: refreshServerCart
    }),
    [addItem, clearCart, items, loading, refreshServerCart, removeItem, updateQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}